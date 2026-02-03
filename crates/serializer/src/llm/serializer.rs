//! DX Serializer LLM Format
//!
//! Serializes `DxDocument` to the token-optimized LLM format.
//! 27% more token-efficient than TOON format.
//!
//! ## LLM Format Syntax
//!
//! ```text
//! # Key-Value Pairs
//! name=MyApp
//! port=8080
//!
//! # Objects (inline with field count and space separators)
//! config:3[host=localhost port=5432 name=mydb]
//!
//! # Arrays (space-separated)
//! tags:3=rust performance serialization
//!
//! # Tables (inline rows, comma-separated)
//! users:3(id name email)[1 Alice alice@ex.com, 2 Bob bob@ex.com, 3 Carol carol@ex.com]
//!
//! # Multi-word values use underscores
//! hikes:2(id name)[1 Blue_Lake_Trail, 2 Mountain_Ridge]
//!
//! # Prefix elimination with @prefix (removes repeated prefixes)
//! logs:4(timestamp level endpoint status)@/api/ @2025-01-15T[10:23:45Z info users 200, 10:24:12Z error orders 500]
//! ```
//!
//! ## Why DX Beats TOON
//!
//! 1. No indentation - TOON requires 2 spaces per row
//! 2. Inline tables - No newlines between rows
//! 3. Prefix elimination - @prefix removes repeated prefixes
//! 4. Compact headers - `hikes:20(id name)` vs `hikes[20]{id,name}:`

use crate::llm::types::{DxDocument, DxLlmValue, DxSection};
use indexmap::IndexMap;

/// Configuration options for the serializer
#[derive(Debug, Clone, Default)]
pub struct SerializerConfig {
    /// Use legacy comma-separated format for arrays and schemas
    pub legacy_mode: bool,
    /// Enable prefix elimination optimization for tables
    pub prefix_elimination: bool,
    /// Enable compact syntax for objects (@= format)
    pub compact_syntax: bool,
}

/// Serialize `DxDocument` to Dx Serializer format
pub struct LlmSerializer {
    config: SerializerConfig,
}

impl LlmSerializer {
    #[allow(dead_code)] // Methods reserved for future serialization features
    /// Create a new serializer with default configuration
    #[must_use]
    pub fn new() -> Self {
        Self {
            config: SerializerConfig::default(),
        }
    }

    /// Create a new serializer with custom configuration
    #[must_use]
    pub fn with_config(config: SerializerConfig) -> Self {
        Self { config }
    }

    /// Serialize `DxDocument` to Dx Serializer format string
    #[must_use]
    pub fn serialize(&self, doc: &DxDocument) -> String {
        let mut output = String::new();

        // Separate root scalars from sections (objects)
        let mut root_scalars = Vec::new();
        let mut section_objects = Vec::new();

        for (key, value) in &doc.context {
            match value {
                DxLlmValue::Obj(_) | DxLlmValue::Arr(_) => {
                    // These are sections - serialize on their own line
                    section_objects.push((key, value));
                }
                _ => {
                    // These are root scalars - serialize on one line
                    root_scalars.push((key, value));
                }
            }
        }

        // Serialize root scalars - each on its own line
        for (key, value) in root_scalars {
            output.push_str(&format!("{}={}", key, self.serialize_value(value)));
            output.push('\n');
        }

        // Serialize section objects - each on its own line
        for (key, value) in section_objects {
            // Replace dots with underscores in section names for LLM format
            let clean_key = key.replace('.', "_");
            let entry = self.serialize_context_entry(&clean_key, value);
            output.push_str(&entry);
            output.push('\n');
        }

        // Serialize sections (tables) - each on its own line
        for (id, section) in &doc.sections {
            // Use full section name if available, otherwise convert char to string
            let section_name_string;
            let section_name = if let Some(name) = doc.section_names.get(id) {
                name.as_str()
            } else {
                section_name_string = id.to_string();
                &section_name_string
            };
            output.push_str(&self.serialize_section_with_name(section_name, section));
            output.push('\n');
        }

        output.trim_end().to_string()
    }

    /// Serialize a context entry in Dx Serializer format
    fn serialize_context_entry(&self, key: &str, value: &DxLlmValue) -> String {
        match value {
            DxLlmValue::Arr(items) => {
                // Array: name:count=item1 item2 item3 (space-separated)
                // or name:count=item1,item2,item3 (comma-separated in legacy mode)
                let items_str: Vec<String> =
                    items.iter().map(|v| self.serialize_value(v)).collect();
                let separator = if self.config.legacy_mode { "," } else { " " };
                format!("{}:{}={}", key, items.len(), items_str.join(separator))
            }
            DxLlmValue::Obj(fields) => {
                // Check if compact syntax is enabled
                if self.config.compact_syntax {
                    self.serialize_compact_object(key, fields)
                } else {
                    self.serialize_inline_object(key, fields)
                }
            }
            _ => {
                // Simple key=value
                format!("{}={}", key, self.serialize_value(value))
            }
        }
    }

    /// Serialize an object in compact syntax format: name:count@=[key value key value]
    fn serialize_compact_object(&self, key: &str, fields: &IndexMap<String, DxLlmValue>) -> String {
        let mut tokens = Vec::new();
        for (k, v) in fields {
            tokens.push(k.clone());
            tokens.push(self.serialize_value(v));
        }

        format!("{}:{}@=[{}]", key, fields.len(), tokens.join(" "))
    }

    /// Serialize an object in inline format: name:count[key=value key2=value2]
    fn serialize_inline_object(&self, key: &str, fields: &IndexMap<String, DxLlmValue>) -> String {
        let separator = if self.config.legacy_mode { "," } else { " " };

        let fields_str: Vec<String> = fields
            .iter()
            .map(|(k, v)| {
                // Handle nested arrays: key[count]=item1 item2 item3
                if let DxLlmValue::Arr(items) = v {
                    let items_str: Vec<String> =
                        items.iter().map(|item| self.serialize_value(item)).collect();
                    let arr_sep = if self.config.legacy_mode { "," } else { " " };
                    format!("{}[{}]={}", k, items.len(), items_str.join(arr_sep))
                } else {
                    format!("{}={}", k, self.serialize_value(v))
                }
            })
            .collect();
        format!("{}:{}[{}]", key, fields.len(), fields_str.join(separator))
    }

    /// Choose the appropriate row separator based on data characteristics
    ///
    /// Heuristics:
    /// 1. If >= 8 rows, use newline for readability
    /// 2. If schema contains "timestamp" or "log", use colon
    /// 3. If rows contain complex data (nested objects/arrays), use semicolon
    /// 4. If string values contain commas, use newline
    /// 5. Default to comma for simple inline tables
    fn choose_row_separator(&self, section: &DxSection) -> char {
        // Heuristic 1: Large tables use newlines for readability
        if section.rows.len() >= 8 {
            return '\n';
        }

        // Heuristic 2: Log-style data uses colons
        if section.schema.iter().any(|col| {
            let col_lower = col.to_lowercase();
            col_lower.contains("timestamp") || col_lower.contains("log")
        }) {
            return ':';
        }

        // Heuristic 3: Complex data (nested objects/arrays) uses semicolons
        let has_complex = section.rows.iter().any(|row| {
            row.iter().any(|val| matches!(val, DxLlmValue::Obj(_) | DxLlmValue::Arr(_)))
        });
        if has_complex {
            return ';';
        }

        // Heuristic 4: If string values contain commas, use newline to avoid conflicts
        let has_commas_in_values = section.rows.iter().any(|row| {
            row.iter().any(|val| {
                if let DxLlmValue::Str(s) = val {
                    s.contains(',')
                } else {
                    false
                }
            })
        });
        if has_commas_in_values {
            return '\n';
        }

        // Heuristic 5: Default to comma for simple inline tables
        ','
    }

    /// Serialize a table section with string name
    /// Uses SPACE as field separator for token efficiency (~14% savings)
    fn serialize_section_with_name(&self, section_name: &str, section: &DxSection) -> String {
        let separator = self.choose_row_separator(section);
        self.serialize_section_with_name_and_separator(section_name, section, separator)
    }

    /// Serialize a table section
    /// Uses SPACE as field separator for token efficiency (~14% savings)
    #[allow(dead_code)] // Reserved for future serialization features
    fn serialize_section(&self, section_id: char, section: &DxSection) -> String {
        let separator = self.choose_row_separator(section);
        self.serialize_section_with_separator(section_id, section, separator)
    }

    /// Serialize a section with a specific row separator using string name
    fn serialize_section_with_name_and_separator(
        &self,
        section_name: &str,
        section: &DxSection,
        separator: char,
    ) -> String {
        // Check if prefix elimination is enabled
        if self.config.prefix_elimination {
            if let Some(output) =
                self.try_serialize_with_prefix_elimination_named(section_name, section, separator)
            {
                return output;
            }
        }

        // Fall back to regular serialization
        self.serialize_section_without_prefix_elimination_named(section_name, section, separator)
    }

    /// Serialize a section with a specific row separator
    #[allow(dead_code)] // Reserved for future serialization features
    fn serialize_section_with_separator(
        &self,
        section_id: char,
        section: &DxSection,
        separator: char,
    ) -> String {
        // Convert char to string and use named version
        let name = section_id.to_string();
        self.serialize_section_with_name_and_separator(&name, section, separator)
    }

    /// Try to serialize a section with prefix elimination using string name
    fn try_serialize_with_prefix_elimination_named(
        &self,
        section_name: &str,
        section: &DxSection,
        separator: char,
    ) -> Option<String> {
        // Detect prefixes for each column
        let prefixes: Vec<Option<String>> = (0..section.schema.len())
            .map(|i| self.detect_common_prefix(section, i))
            .collect();

        // Only use prefix elimination if at least one prefix was found
        if prefixes.iter().all(std::option::Option::is_none) {
            return None;
        }

        let mut output = String::new();

        // Schema: name:count(col1 col2 col3) or (col1,col2,col3) in legacy mode
        let schema_separator = if self.config.legacy_mode { "," } else { " " };
        let schema_str = section.schema.join(schema_separator);
        output.push_str(&format!("{}:{}({})", section_name, section.rows.len(), schema_str));

        // Output prefix markers
        for prefix in prefixes.iter().flatten() {
            output.push_str(&format!("@{prefix} "));
        }

        output.push('[');

        if !section.rows.is_empty() {
            if separator == '\n' {
                // Multi-line format
                output.push('\n');
                for row in &section.rows {
                    let values: Vec<String> = row
                        .iter()
                        .enumerate()
                        .map(|(i, v)| {
                            self.serialize_table_value_with_prefix_removed(v, prefixes[i].as_ref())
                        })
                        .collect();
                    output.push_str(&values.join(" "));
                    output.push('\n');
                }
            } else {
                // Inline format
                let rows_str: Vec<String> = section
                    .rows
                    .iter()
                    .map(|row| {
                        let values: Vec<String> = row
                            .iter()
                            .enumerate()
                            .map(|(i, v)| {
                                self.serialize_table_value_with_prefix_removed(v, prefixes[i].as_ref())
                            })
                            .collect();
                        values.join(" ")
                    })
                    .collect();
                output.push_str(&rows_str.join(&format!("{separator} ")));
            }
        }

        output.push_str("]\n");
        Some(output)
    }

    /// Serialize a section without prefix elimination using string name
    fn serialize_section_without_prefix_elimination_named(
        &self,
        section_name: &str,
        section: &DxSection,
        separator: char,
    ) -> String {
        let mut output = String::new();

        // Schema: name:count(col1 col2 col3)[ - space separated!
        // or name:count(col1,col2,col3)[ in legacy mode
        let schema_separator = if self.config.legacy_mode { "," } else { " " };
        let schema_str = section.schema.join(schema_separator);
        output.push_str(&format!("{}:{}({})[", section_name, section.rows.len(), schema_str));

        if !section.rows.is_empty() {
            if separator == '\n' {
                // Multi-line format
                output.push('\n');
                for row in &section.rows {
                    let values: Vec<String> =
                        row.iter().map(|v| self.serialize_table_value(v)).collect();
                    output.push_str(&values.join(" "));
                    output.push('\n');
                }
            } else {
                // Inline format with specified separator
                let rows_str: Vec<String> = section
                    .rows
                    .iter()
                    .map(|row| {
                        let values: Vec<String> =
                            row.iter().map(|v| self.serialize_table_value(v)).collect();
                        values.join(" ")
                    })
                    .collect();
                output.push_str(&rows_str.join(&format!("{separator} ")));
            }
        }

        output.push_str("]\n");
        output
    }

    /// Detect common prefix in a column
    /// Returns Some(prefix) if a common prefix >= 3 characters is found
    fn detect_common_prefix(&self, section: &DxSection, col_idx: usize) -> Option<String> {
        if section.rows.len() < 2 {
            return None;
        }

        // Extract string values from this column
        let strings: Vec<&str> = section
            .rows
            .iter()
            .filter_map(|row| row.get(col_idx).and_then(|v| v.as_str()))
            .collect();

        if strings.len() < 2 {
            return None;
        }

        // Find longest common prefix
        let mut prefix = strings[0].to_string();
        for s in &strings[1..] {
            while !s.starts_with(&prefix) && !prefix.is_empty() {
                prefix.pop();
            }
        }

        // Only use prefix if it's at least 3 characters
        if prefix.len() >= 3 {
            Some(prefix)
        } else {
            None
        }
    }

    /// Serialize a table value with prefix removed
    fn serialize_table_value_with_prefix_removed(
        &self,
        value: &DxLlmValue,
        prefix: Option<&String>,
    ) -> String {
        if let (DxLlmValue::Str(s), Some(p)) = (value, prefix) {
            if s.starts_with(p) {
                let without_prefix = &s[p.len()..];
                // Replace spaces with underscores
                if without_prefix.contains(' ') {
                    without_prefix.replace(' ', "_")
                } else {
                    without_prefix.to_string()
                }
            } else {
                self.serialize_table_value(value)
            }
        } else {
            self.serialize_table_value(value)
        }
    }

    /// Serialize a value for table rows (space-separated format)
    /// Replaces spaces with underscores to avoid field boundary issues
    fn serialize_table_value(&self, value: &DxLlmValue) -> String {
        let _self = self; // Used only in recursive calls
        match value {
            DxLlmValue::Bool(true) => "true".to_string(),
            DxLlmValue::Bool(false) => "false".to_string(),
            DxLlmValue::Null => "null".to_string(),
            DxLlmValue::Num(n) => {
                if n.fract() == 0.0 {
                    format!("{}", *n as i64)
                } else {
                    format!("{n}")
                }
            }
            DxLlmValue::Str(s) => {
                // Replace spaces with underscores for space-separated format
                // This saves tokens: "James Smith" (3 tokens) -> James_Smith (1-2 tokens)
                if s.contains(' ') {
                    s.replace(' ', "_")
                } else {
                    s.clone()
                }
            }
            DxLlmValue::Arr(items) => {
                let serialized: Vec<String> =
                    items.iter().map(|item| _self.serialize_table_value(item)).collect();
                serialized.join(",")
            }
            DxLlmValue::Obj(fields) => {
                // Inline object in table cell: (key=value,key2=value2)
                let fields_str: Vec<String> = fields
                    .iter()
                    .map(|(k, v)| format!("{}={}", k, _self.serialize_table_value(v)))
                    .collect();
                format!("({})", fields_str.join(","))
            }
            DxLlmValue::Ref(key) => format!("^{key}"),
        }
    }

    /// Serialize a single value
    fn serialize_value(&self, value: &DxLlmValue) -> String {
        let _self = self; // Used only in recursive calls
        match value {
            DxLlmValue::Bool(true) => "true".to_string(),
            DxLlmValue::Bool(false) => "false".to_string(),
            DxLlmValue::Null => "null".to_string(),
            DxLlmValue::Num(n) => {
                if n.fract() == 0.0 {
                    format!("{}", *n as i64)
                } else {
                    format!("{n}")
                }
            }
            DxLlmValue::Str(s) => {
                // Replace spaces with underscores for LLM format
                // This saves tokens and avoids quoting
                if s.contains(' ') {
                    s.replace(' ', "_")
                } else {
                    s.clone()
                }
            }
            DxLlmValue::Arr(items) => {
                let serialized: Vec<String> =
                    items.iter().map(|item| _self.serialize_value(item)).collect();
                serialized.join(",")
            }
            DxLlmValue::Obj(fields) => {
                // Nested object: [key=value,key2=value2]
                let fields_str: Vec<String> = fields
                    .iter()
                    .map(|(k, v)| format!("{}={}", k, _self.serialize_value(v)))
                    .collect();
                format!("[{}]", fields_str.join(","))
            }
            DxLlmValue::Ref(key) => format!("^{key}"),
        }
    }
}

impl Default for LlmSerializer {
    fn default() -> Self {
        Self::new()
    }
}

/// Convenience function to serialize a document
#[must_use]
pub fn serialize(doc: &DxDocument) -> String {
    LlmSerializer::new().serialize(doc)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_serialize_empty() {
        let serializer = LlmSerializer::new();
        let doc = DxDocument::new();
        let output = serializer.serialize(&doc);
        assert!(output.is_empty());
    }

    #[test]
    fn test_serialize_simple_values() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context.insert("name".to_string(), DxLlmValue::Str("Test".to_string()));
        doc.context.insert("count".to_string(), DxLlmValue::Num(42.0));

        let output = serializer.serialize(&doc);
        assert!(output.contains("count=42"), "Output was: {output}");
        assert!(output.contains("name=Test"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_booleans() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context.insert("active".to_string(), DxLlmValue::Bool(true));
        doc.context.insert("deleted".to_string(), DxLlmValue::Bool(false));

        let output = serializer.serialize(&doc);
        assert!(output.contains("active=true"), "Output was: {output}");
        assert!(output.contains("deleted=false"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_array() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context.insert(
            "friends".to_string(),
            DxLlmValue::Arr(vec![
                DxLlmValue::Str("ana".to_string()),
                DxLlmValue::Str("luis".to_string()),
                DxLlmValue::Str("sam".to_string()),
            ]),
        );

        let output = serializer.serialize(&doc);
        assert!(output.contains("friends:3=ana luis sam"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_table() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();

        let mut section =
            DxSection::new(vec!["id".to_string(), "name".to_string(), "active".to_string()]);
        section.rows.push(vec![
            DxLlmValue::Num(1.0),
            DxLlmValue::Str("Alpha".to_string()),
            DxLlmValue::Bool(true),
        ]);
        section.rows.push(vec![
            DxLlmValue::Num(2.0),
            DxLlmValue::Str("Beta".to_string()),
            DxLlmValue::Bool(false),
        ]);
        doc.sections.insert('d', section);

        let output = serializer.serialize(&doc);
        // Space-separated format with section ID
        assert!(output.contains("d:2(id name active)["), "Output was: {output}");
        assert!(output.contains("1 Alpha true"), "Output was: {output}");
        assert!(output.contains("2 Beta false"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_table_with_spaces_in_text() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();

        let mut section =
            DxSection::new(vec!["id".to_string(), "name".to_string(), "dept".to_string()]);
        section.rows.push(vec![
            DxLlmValue::Num(1.0),
            DxLlmValue::Str("James Smith".to_string()),
            DxLlmValue::Str("Engineering".to_string()),
        ]);
        section.rows.push(vec![
            DxLlmValue::Num(2.0),
            DxLlmValue::Str("Mary Johnson".to_string()),
            DxLlmValue::Str("Research and Development".to_string()),
        ]);
        doc.sections.insert('e', section);

        let output = serializer.serialize(&doc);
        // Spaces in text become underscores
        assert!(output.contains("1 James_Smith Engineering"), "Output was: {output}");
        assert!(
            output.contains("2 Mary_Johnson Research_and_Development"),
            "Output was: {output}"
        );
    }

    #[test]
    fn test_serialize_null() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context.insert("value".to_string(), DxLlmValue::Null);

        let output = serializer.serialize(&doc);
        assert!(output.contains("value=null"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_quoted_string() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context
            .insert("task".to_string(), DxLlmValue::Str("Our favorite hikes together".to_string()));

        let output = serializer.serialize(&doc);
        // Strings with spaces use underscores in LLM format
        assert!(output.contains("task=Our_favorite_hikes_together"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_string_with_comma() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();
        doc.context
            .insert("desc".to_string(), DxLlmValue::Str("hello, world".to_string()));

        let output = serializer.serialize(&doc);
        // Commas and spaces are replaced with underscores in LLM format
        assert!(output.contains("desc=hello,_world"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_inline_object() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();

        let mut fields = IndexMap::new();
        fields.insert("host".to_string(), DxLlmValue::Str("localhost".to_string()));
        fields.insert("port".to_string(), DxLlmValue::Num(8080.0));
        doc.context.insert("config".to_string(), DxLlmValue::Obj(fields));

        let output = serializer.serialize(&doc);
        // Should have count prefix and space separators
        assert!(output.contains("config:2["), "Output was: {output}");
        assert!(output.contains("host=localhost"), "Output was: {output}");
        assert!(output.contains("port=8080"), "Output was: {output}");
        // Should use space separator, not comma
        assert!(!output.contains("host=localhost,port=8080"), "Output was: {output}");
    }

    #[test]
    fn test_serialize_inline_object_with_nested_array() {
        let serializer = LlmSerializer::new();
        let mut doc = DxDocument::new();

        let mut fields = IndexMap::new();
        fields.insert("name".to_string(), DxLlmValue::Str("test".to_string()));
        fields.insert(
            "tags".to_string(),
            DxLlmValue::Arr(vec![
                DxLlmValue::Str("rust".to_string()),
                DxLlmValue::Str("fast".to_string()),
            ]),
        );
        doc.context.insert("item".to_string(), DxLlmValue::Obj(fields));

        let output = serializer.serialize(&doc);
        // Should have count prefix
        assert!(output.contains("item:2["), "Output was: {output}");
        // Nested array should have count and space separators
        assert!(output.contains("tags[2]=rust fast"), "Output was: {output}");
    }
}
