# DX Serializer Format Reference

## Three Format Architecture

### 1. Human Format (.toml, .sr files)
**Purpose**: Source of truth on disk, easy to read/edit, version control friendly

**Characteristics**:
- Uses FULL key names (e.g., `name`, `version`, `editor`)
- TOML-like syntax with `key = value`
- Arrays use list format with `-` bullets
- Spaces around `=` for readability
- Multi-word values use spaces (e.g., `"Our favorite hikes"`)

**Example**:
```toml
name = TestApp
version = 1.0.0
active = true

editor[2]:
- neovim
- vscode

[dependencies:1]
name = dx-package-1
version = 0.0.1

[dependencies:2]
name = dx-package-2
version = 0.0.1
```

### 2. LLM Format (.llm files)
**Purpose**: Token-efficient for AI context windows (52-73% savings vs JSON)

**Characteristics**:
- Uses FULL key names (e.g., `name`, `version`, `editor`)
- NO spaces around `=` (compact)
- Multi-word values use UNDERSCORES (e.g., `Our_favorite_hikes_together`)
- Arrays use inline format: `key:count=value1 value2 value3`
- Tables use compact notation: `section:count(schema)[rows]`
- NO quotes for strings

**Example**:
```
author=essensefromexistence
version=0.0.1
name=dx
description=Orchestrate_dont_just_own_your_code
title=Enhanced_Developing_Experience
driven:1[path=@/driven]
editors:2[default=neovim items[7]=neovim zed vscode cursor antigravity replit firebase-studio]
dependencies:2(name version)[dx-package-1 0.0.1, dx-package-2 0.0.1]
```

**Format Rules**:
- Each root key-value pair on its own line
- Each section on its own line
- NO spaces around `=`
- Multi-word values use underscores (not quotes)
- Section names with dots converted to underscores

### 3. Machine Format (.machine files)
**Purpose**: Binary format for zero-copy deserialization, maximum performance

**Characteristics**:
- Binary encoding using RKYV
- Zero-copy access
- Minimal overhead
- Not human-readable

## Key Differences Summary

| Feature | Human Format | LLM Format | Machine Format |
|---------|-------------|------------|----------------|
| **Keys** | Full names | Full names | Binary |
| **Spaces** | Around `=` | No spaces | N/A |
| **Multi-word values** | Quoted strings | Underscores | Binary |
| **Arrays** | List format (`-`) | Inline (`key:count=v1 v2`) | Binary |
| **Purpose** | Edit/VCS | AI context | Performance |
| **Location** | Disk (source) | `.dx/serializer/` | `.dx/serializer/` |

## CRITICAL RULES

### ✅ DO:
- Use FULL key names in ALL formats (e.g., `name`, `version`, `editor`)
- Use underscores for multi-word values in LLM format
- Use quoted strings for multi-word values in Human format
- Preserve insertion order with IndexMap

### ❌ DON'T:
- Use abbreviated keys (e.g., `nm`, `v`, `ed`) - NEVER!
- Use quotes in LLM format
- Use spaces in LLM format multi-word values
- Sort keys alphabetically (preserve insertion order)

## Test Data Examples

### Good Test Data:
```rust
doc.context.insert("name".to_string(), DxLlmValue::Str("TestApp".to_string()));
doc.context.insert("version".to_string(), DxLlmValue::Str("1.0.0".to_string()));
doc.context.insert("editor".to_string(), DxLlmValue::Arr(vec![...]));
doc.context.insert("active".to_string(), DxLlmValue::Bool(true));
```

### Bad Test Data (NEVER USE):
```rust
doc.context.insert("nm".to_string(), ...);  // ❌ Use "name"
doc.context.insert("v".to_string(), ...);   // ❌ Use "version"
doc.context.insert("ed".to_string(), ...);  // ❌ Use "editor"
doc.context.insert("ct".to_string(), ...);  // ❌ Use "count"
doc.context.insert("ac".to_string(), ...);  // ❌ Use "active"
```

## Format Conversion Examples

### Input (Human Format):
```toml
name = Our Favorite Hikes
description = Beautiful mountain trails
count = 42
```

### Output (LLM Format):
```
name=Our_Favorite_Hikes description=Beautiful_mountain_trails count=42
```

### Input (Human Format with Array):
```toml
workspaces[3]:
- frontend/www
- backend/api
- shared/utils
```

### Output (LLM Format):
```
workspaces:3=frontend/www backend/api shared/utils
```
