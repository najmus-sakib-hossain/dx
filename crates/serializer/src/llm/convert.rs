//! Format conversion functions
//!
//! Provides conversion between DX Serializer (LLM), Human, and Machine formats.
//! All conversions go through the common `DxDocument` representation.

use crate::llm::human_formatter::{HumanFormatConfig, HumanFormatter};
use crate::llm::human_parser::{HumanParseError, HumanParser};
use crate::llm::parser::{LlmParser, ParseError};
use crate::llm::serializer::LlmSerializer;
use crate::llm::types::DxDocument;
use thiserror::Error;

/// Conversion errors
#[derive(Debug, Error)]
pub enum ConvertError {
    #[error("DX Serializer parse error: {0}")]
    LlmParse(#[from] ParseError),

    #[error("Human parse error: {0}")]
    HumanParse(#[from] HumanParseError),

    #[error("Machine format error: {msg}")]
    MachineFormat { msg: String },
}

/// Convert DX Serializer format string to Human format string
#[must_use = "conversion result should be used"]
pub fn llm_to_human(llm_input: &str) -> Result<String, ConvertError> {
    let doc = LlmParser::parse(llm_input)?;
    let formatter = HumanFormatter::new();
    Ok(formatter.format(&doc))
}

/// Convert DX Serializer format string to Human format string with custom config
pub fn llm_to_human_with_config(
    llm_input: &str,
    config: HumanFormatConfig,
) -> Result<String, ConvertError> {
    let doc = LlmParser::parse(llm_input)?;
    let formatter = HumanFormatter::with_config(config);
    Ok(formatter.format(&doc))
}

/// Convert Human format string to DX Serializer format string
#[must_use = "conversion result should be used"]
pub fn human_to_llm(human_input: &str) -> Result<String, ConvertError> {
    let trimmed = human_input.trim();

    // Check if input is already DX Serializer format
    if is_dsr_format(trimmed) {
        return Ok(human_input.to_string());
    }

    // Parse as Human format and convert to DX Serializer
    let parser = HumanParser::new();
    let doc = parser.parse(human_input)?;
    let serializer = LlmSerializer::new();
    Ok(serializer.serialize(&doc))
}

/// Check if input is in DX Serializer format
#[must_use]
pub fn is_dsr_format(input: &str) -> bool {
    let trimmed = input.trim();

    // DX Serializer format indicators:
    // - name[key=value,...] (objects) - NOT [name] which is TOML section
    // - name:count(schema)[data] (tables)
    // - name:count=items (arrays)
    // - key=value (simple pairs, NO spaces around =)

    // Human format indicators (should return false):
    // - [section] (TOML section headers)
    // - key = value (spaces around =)
    // - key[count]: followed by - items (list format)

    let mut has_dsr_indicators = false;
    let mut has_human_indicators = false;

    for line in trimmed.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        // TOML section headers start with [ - this is HUMAN format
        if line.starts_with('[') {
            has_human_indicators = true;
            continue;
        }

        // List items starting with - are HUMAN format
        if line.starts_with('-') {
            has_human_indicators = true;
            continue;
        }

        // Check for spaces around = (HUMAN format: "key = value")
        if line.contains(" = ") {
            has_human_indicators = true;
            continue;
        }

        // Check for table syntax: name:count(schema)[
        if line.contains(':') && line.contains('(') && line.contains('[') {
            has_dsr_indicators = true;
            continue;
        }

        // Check for array syntax: name:count=items (DSR format)
        if line.contains(':') && line.contains('=') {
            let colon_pos = line.find(':');
            let eq_pos = line.find('=');
            if let (Some(cp), Some(ep)) = (colon_pos, eq_pos) {
                if cp < ep {
                    has_dsr_indicators = true;
                    continue;
                }
            }
        }

        // Check for compact key=value (NO spaces around =) - DSR format
        if line.contains('=') && !line.contains(" = ") {
            if let Some(eq_pos) = line.find('=') {
                let before = &line[..eq_pos];
                let after = &line[eq_pos + 1..];
                // DSR has no trailing space before = and no leading space after =
                if !before.ends_with(' ') && !after.starts_with(' ') {
                    has_dsr_indicators = true;
                    continue;
                }
            }
        }
    }

    // If we found human format indicators, it's NOT DSR format
    if has_human_indicators {
        return false;
    }

    // Only return true if we found DSR indicators
    has_dsr_indicators
}

/// Check if input is in LLM format (alias for `is_dsr_format`)
#[must_use]
pub fn is_llm_format(input: &str) -> bool {
    is_dsr_format(input)
}

/// Convert DX Serializer format string to `DxDocument`
#[must_use = "parsing result should be used"]
pub fn llm_to_document(llm_input: &str) -> Result<DxDocument, ConvertError> {
    Ok(LlmParser::parse(llm_input)?)
}

/// Convert Human format string to `DxDocument`
#[must_use = "parsing result should be used"]
pub fn human_to_document(human_input: &str) -> Result<DxDocument, ConvertError> {
    let parser = HumanParser::new();
    Ok(parser.parse(human_input)?)
}

/// Convert `DxDocument` to DX Serializer format string
#[must_use]
pub fn document_to_llm(doc: &DxDocument) -> String {
    let serializer = LlmSerializer::new();
    serializer.serialize(doc)
}

/// Convert `DxDocument` to Human format string
#[must_use]
pub fn document_to_human(doc: &DxDocument) -> String {
    let formatter = HumanFormatter::new();
    formatter.format(doc)
}

/// Convert `DxDocument` to Human format string with custom config
#[must_use]
pub fn document_to_human_with_config(doc: &DxDocument, config: HumanFormatConfig) -> String {
    let formatter = HumanFormatter::with_config(config);
    formatter.format(doc)
}

/// Machine format representation (binary)
#[derive(Debug, Clone)]
pub struct MachineFormat {
    pub data: Vec<u8>,
}

/// Convert DX Serializer format to Machine format (binary with LZ4 compression)
pub fn llm_to_machine(llm_input: &str) -> Result<MachineFormat, ConvertError> {
    let doc = LlmParser::parse(llm_input)?;
    Ok(document_to_machine_compressed(&doc))
}

/// Convert Human format to Machine format (binary with LZ4 compression)
pub fn human_to_machine(human_input: &str) -> Result<MachineFormat, ConvertError> {
    let parser = HumanParser::new();
    let doc = parser.parse(human_input)?;
    Ok(document_to_machine_compressed(&doc))
}

/// Convert `DxDocument` to Machine format (binary, uncompressed)
#[must_use]
pub fn document_to_machine(doc: &DxDocument) -> MachineFormat {
    let mut data = Vec::new();

    // Magic number
    data.extend_from_slice(b"DXMF");
    data.push(1); // Version

    // Context section
    let context_count = doc.context.len() as u32;
    data.extend_from_slice(&context_count.to_le_bytes());
    for (key, value) in &doc.context {
        write_string(&mut data, key);
        write_value(&mut data, value);
    }

    // Sections
    let sections_count = doc.sections.len() as u32;
    data.extend_from_slice(&sections_count.to_le_bytes());
    for (id, section) in &doc.sections {
        data.push(*id as u8);

        let schema_count = section.schema.len() as u32;
        data.extend_from_slice(&schema_count.to_le_bytes());
        for col in &section.schema {
            write_string(&mut data, col);
        }

        let rows_count = section.rows.len() as u32;
        data.extend_from_slice(&rows_count.to_le_bytes());
        for row in &section.rows {
            for value in row {
                write_value(&mut data, value);
            }
        }
    }

    MachineFormat { data }
}

/// Convert `DxDocument` to Machine format (binary with LZ4 compression)
#[cfg(feature = "compression")]
#[must_use]
pub fn document_to_machine_compressed(doc: &DxDocument) -> MachineFormat {
    use crate::machine::compress::DxCompressed;

    // First create uncompressed machine format
    let uncompressed = document_to_machine(doc);

    // Compress with LZ4
    let compressed = DxCompressed::compress(&uncompressed.data);

    // Create new machine format with compressed data
    // Format: DXMC (4 bytes) | version (1 byte) | compressed data (LZ4 with prepended size)
    let mut data = Vec::new();
    data.extend_from_slice(b"DXMC"); // Magic for compressed
    data.push(1); // Version
    data.extend_from_slice(compressed.as_compressed());

    MachineFormat { data }
}

/// Convert DxDocument to Machine format (binary, fallback without compression)
#[cfg(not(feature = "compression"))]
pub fn document_to_machine_compressed(doc: &DxDocument) -> MachineFormat {
    document_to_machine(doc)
}

/// Convert Machine format to `DxDocument` (handles both compressed and uncompressed)
pub fn machine_to_document(machine: &MachineFormat) -> Result<DxDocument, ConvertError> {
    use crate::llm::types::DxSection;

    let data = &machine.data;

    // Check if compressed (DXMC) or uncompressed (DXMF)
    if data.len() < 5 {
        return Err(ConvertError::MachineFormat {
            msg: "Data too short".to_string(),
        });
    }

    let magic = &data[0..4];

    // Handle compressed format
    #[cfg(feature = "compression")]
    if magic == b"DXMC" {
        let version = data[4];
        if version != 1 {
            return Err(ConvertError::MachineFormat {
                msg: format!("Unsupported compressed version: {version}"),
            });
        }

        // The compressed data starts at byte 5 (after magic + version)
        // LZ4 format has size prepended, so we can decompress directly
        if data.len() < 6 {
            return Err(ConvertError::MachineFormat {
                msg: "Compressed data too short".to_string(),
            });
        }

        // Decompress using lz4_flex which handles the prepended size
        #[cfg(feature = "compression")]
        let decompressed =
            crate::machine::compress::lz4_decompress_fast(&data[5..]).map_err(|e| {
                ConvertError::MachineFormat {
                    msg: format!("Decompression failed: {e}"),
                }
            })?;

        // Parse decompressed data
        let uncompressed_machine = MachineFormat { data: decompressed };
        return machine_to_document(&uncompressed_machine);
    }

    // Handle uncompressed format
    if magic != b"DXMF" {
        return Err(ConvertError::MachineFormat {
            msg: "Invalid magic number".to_string(),
        });
    }

    let mut pos = 4;
    let version = data[pos];
    if version != 1 {
        return Err(ConvertError::MachineFormat {
            msg: format!("Unsupported version: {version}"),
        });
    }
    pos += 1;

    let mut doc = DxDocument::new();

    // Read context
    let context_count = read_u32(data, &mut pos)?;
    for _ in 0..context_count {
        let key = read_string(data, &mut pos)?;
        let value = read_value(data, &mut pos)?;
        doc.context.insert(key, value);
    }

    // Read sections
    let sections_count = read_u32(data, &mut pos)?;
    for _ in 0..sections_count {
        if pos >= data.len() {
            return Err(ConvertError::MachineFormat {
                msg: "Unexpected end of data".to_string(),
            });
        }
        let id = data[pos] as char;
        pos += 1;

        let schema_count = read_u32(data, &mut pos)?;
        let mut schema = Vec::new();
        for _ in 0..schema_count {
            schema.push(read_string(data, &mut pos)?);
        }

        let mut section = DxSection::new(schema.clone());

        let rows_count = read_u32(data, &mut pos)?;
        for _ in 0..rows_count {
            let mut row = Vec::new();
            for _ in 0..schema.len() {
                row.push(read_value(data, &mut pos)?);
            }
            section.rows.push(row);
        }

        doc.sections.insert(id, section);
    }

    Ok(doc)
}

/// Convert Machine format to DX Serializer format string
pub fn machine_to_llm(machine: &MachineFormat) -> Result<String, ConvertError> {
    let doc = machine_to_document(machine)?;
    Ok(document_to_llm(&doc))
}

/// Convert Machine format to Human format string
pub fn machine_to_human(machine: &MachineFormat) -> Result<String, ConvertError> {
    let doc = machine_to_document(machine)?;
    Ok(document_to_human(&doc))
}

// Helper functions

fn write_string(data: &mut Vec<u8>, s: &str) {
    let bytes = s.as_bytes();
    let len = bytes.len() as u32;
    data.extend_from_slice(&len.to_le_bytes());
    data.extend_from_slice(bytes);
}

fn write_value(data: &mut Vec<u8>, value: &crate::llm::types::DxLlmValue) {
    use crate::llm::types::DxLlmValue;

    match value {
        DxLlmValue::Str(s) => {
            data.push(0);
            write_string(data, s);
        }
        DxLlmValue::Num(n) => {
            data.push(1);
            data.extend_from_slice(&n.to_le_bytes());
        }
        DxLlmValue::Bool(b) => {
            data.push(2);
            data.push(u8::from(*b));
        }
        DxLlmValue::Null => {
            data.push(3);
        }
        DxLlmValue::Arr(items) => {
            data.push(4);
            let len = items.len() as u32;
            data.extend_from_slice(&len.to_le_bytes());
            for item in items {
                write_value(data, item);
            }
        }
        DxLlmValue::Ref(key) => {
            data.push(5);
            write_string(data, key);
        }
        DxLlmValue::Obj(fields) => {
            data.push(6);
            let len = fields.len() as u32;
            data.extend_from_slice(&len.to_le_bytes());
            for (key, val) in fields {
                write_string(data, key);
                write_value(data, val);
            }
        }
    }
}

fn read_u32(data: &[u8], pos: &mut usize) -> Result<u32, ConvertError> {
    if *pos + 4 > data.len() {
        return Err(ConvertError::MachineFormat {
            msg: "Unexpected end of data reading u32".to_string(),
        });
    }
    let bytes: [u8; 4] =
        data[*pos..*pos + 4]
            .try_into()
            .map_err(|_| ConvertError::MachineFormat {
                msg: "Failed to read u32".to_string(),
            })?;
    *pos += 4;
    Ok(u32::from_le_bytes(bytes))
}

fn read_string(data: &[u8], pos: &mut usize) -> Result<String, ConvertError> {
    let len = read_u32(data, pos)? as usize;
    if *pos + len > data.len() {
        return Err(ConvertError::MachineFormat {
            msg: "Unexpected end of data reading string".to_string(),
        });
    }
    let s = String::from_utf8(data[*pos..*pos + len].to_vec()).map_err(|_| {
        ConvertError::MachineFormat {
            msg: "Invalid UTF-8 string".to_string(),
        }
    })?;
    *pos += len;
    Ok(s)
}

fn read_value(data: &[u8], pos: &mut usize) -> Result<crate::llm::types::DxLlmValue, ConvertError> {
    use crate::llm::types::DxLlmValue;
    use indexmap::IndexMap;

    if *pos >= data.len() {
        return Err(ConvertError::MachineFormat {
            msg: "Unexpected end of data reading value".to_string(),
        });
    }

    let type_tag = data[*pos];
    *pos += 1;

    match type_tag {
        0 => Ok(DxLlmValue::Str(read_string(data, pos)?)),
        1 => {
            if *pos + 8 > data.len() {
                return Err(ConvertError::MachineFormat {
                    msg: "Unexpected end of data reading number".to_string(),
                });
            }
            let bytes: [u8; 8] =
                data[*pos..*pos + 8]
                    .try_into()
                    .map_err(|_| ConvertError::MachineFormat {
                        msg: "Failed to read f64".to_string(),
                    })?;
            *pos += 8;
            Ok(DxLlmValue::Num(f64::from_le_bytes(bytes)))
        }
        2 => {
            if *pos >= data.len() {
                return Err(ConvertError::MachineFormat {
                    msg: "Unexpected end of data reading bool".to_string(),
                });
            }
            let b = data[*pos] != 0;
            *pos += 1;
            Ok(DxLlmValue::Bool(b))
        }
        3 => Ok(DxLlmValue::Null),
        4 => {
            let len = read_u32(data, pos)? as usize;
            let mut items = Vec::with_capacity(len);
            for _ in 0..len {
                items.push(read_value(data, pos)?);
            }
            Ok(DxLlmValue::Arr(items))
        }
        5 => Ok(DxLlmValue::Ref(read_string(data, pos)?)),
        6 => {
            let len = read_u32(data, pos)? as usize;
            let mut fields = IndexMap::with_capacity(len);
            for _ in 0..len {
                let key = read_string(data, pos)?;
                let val = read_value(data, pos)?;
                fields.insert(key, val);
            }
            Ok(DxLlmValue::Obj(fields))
        }
        _ => Err(ConvertError::MachineFormat {
            msg: format!("Unknown type tag: {type_tag}"),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::llm::types::DxLlmValue;

    #[test]
    fn test_llm_to_human() {
        let llm = "name=Test\ncount=42";
        let human = llm_to_human(llm).unwrap();
        assert!(human.contains("name") || human.contains("Test"));
    }

    #[test]
    fn test_human_to_llm() {
        let human = r#"
[config]
    name = "Test"
    count = 42
"#;
        let llm = human_to_llm(human).unwrap();
        // DX Serializer format uses : or :: for key-value pairs
        assert!(llm.contains(':') || llm.contains("Test"));
    }

    #[test]
    fn test_machine_format_round_trip() {
        let mut doc = DxDocument::new();
        doc.context
            .insert("name".to_string(), DxLlmValue::Str("Test".to_string()));
        doc.context
            .insert("count".to_string(), DxLlmValue::Num(42.0));
        doc.context
            .insert("active".to_string(), DxLlmValue::Bool(true));

        let machine = document_to_machine(&doc);
        let round_trip_doc = machine_to_document(&machine).unwrap();

        assert_eq!(doc.context.len(), round_trip_doc.context.len());
        assert_eq!(
            round_trip_doc.context.get("name").unwrap().as_str(),
            Some("Test")
        );
        assert_eq!(
            round_trip_doc.context.get("count").unwrap().as_num(),
            Some(42.0)
        );
    }

    #[test]
    fn test_is_dsr_format() {
        // DX Serializer format
        assert!(is_dsr_format("name=Test"));
        assert!(is_dsr_format("config[host=localhost,port=8080]"));
        assert!(is_dsr_format("friends:3=ana,luis,sam"));
        assert!(is_dsr_format("table:2(id,name)[1,John\n2,Jane]"));

        // Not DX Serializer format (Human/TOML-like)
        assert!(!is_dsr_format("[config]\nname = Test"));
    }
}
