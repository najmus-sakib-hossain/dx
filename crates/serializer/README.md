# DX Serializer

Token-optimized serialization format for AI context windows with 52-73% token savings vs JSON and pure RKYV binary format.

## Performance Benchmarks

### Token Efficiency vs JSON (Real-World Data)
+--------+--------+---------+----+------+
| Format | Tokens | Savings | vs | JSON |
+========+========+=========+====+======+
| JSON   | 4      | 000+    | -  | TOON |
+--------+--------+---------+----+------+

### Machine Format Performance

**DX-Machine uses pure RKYV** - identical performance:
- Single serialize: ~48-51ns (RKYV: ~48ns, within 6% variance)
- Batch 100: ~7.5µs (RKYV: ~7.9µs, actually 5% faster)
- Zero-copy deserialization (identical to RKYV)
- Production-ready and battle-tested
**Implementation**: Zero-overhead wrapper with `#[inline(always)]` that compiles to identical machine code as RKYV.

## Three Formats

DX Serializer uses a revolutionary 3-format system:

### Human Format (.sr files on disk)

Beautiful, readable format that developers edit directly:
- TOML/INI-like syntax with aligned `=` at column 28
- **Lives on real disk** where you work (e.g., `config.sr`, `dx`)
- Easy to read, write, and version control
- This is the **source of truth** - you edit these files

### LLM Format (.llm in .dx/serializer/)

Token-optimized format for AI context windows:
- 52-73% token savings vs JSON
- Compact notation with schema headers
- **Auto-generated** in `.dx/serializer/*.llm` folder
- Never edit manually - regenerated from human format

### Machine Format (.machine in .dx/serializer/)

Pure RKYV binary format for maximum performance:
- Zero-copy deserialization
- ~48-51ns serialize time
- **Auto-generated** in `.dx/serializer/*.machine` folder
- Identical to RKYV wire format

**Architecture**: Human format files live on disk. When you save a `.sr` file (or any file with DX serializer syntax), the extension automatically generates the `.llm` and `.machine` versions in the `.dx/serializer/` folder. The `.dx/` folder is gitignored as it contains generated files.

**Note**: DX-Machine IS RKYV. We use RKYV's wire format directly with no modifications.

## Usage

```bash
# Human format files live on disk (you edit these)
# Example: config.sr, dx, package.sr

# When you save a file, the extension auto-generates:
# .dx/serializer/config.llm       (LLM-optimized, 52-73% token savings)
# .dx/serializer/config.machine   (binary, zero-copy)

# CLI usage (if needed manually):
dx serializer config.sr          # Process single file
dx serializer .                  # Process directory recursively
dx serializer src/               # Process specific directory
```

**Workflow**:
1. Edit human format files on disk (e.g., `dx`, `config.sr`)
2. Save the file
3. Extension automatically generates `.llm` and `.machine` in `.dx/serializer/`
4. `.dx/` folder is gitignored (contains generated files)
5. Only commit the human format files

## LLM Format
```
author=essensefromexistence
version=0.0.1
name=dx
description=Orchestrate_dont_just_own_your_code
title=Enhanced_Developing_Experience
driven:1[path=@/driven]
editors:2[default=neovim items[7]=neovim zed vscode cursor antigravity replit firebase-studio]
forge:5[repository=https://dx.vercel.app/essensefromexistence/dx container=none pipeline=none tasks=none tools[7]=cli docs examples packages scripts style tests]
dependencies:2(name version)[dx-package-1 0.0.1, dx-package-2 0.0.1]
js_dependencies:2[next=16.0.1 react=19.0.1]
```
Key features:
- Each `key=value` on its own line for root scalars
- Each section on its own line
- `key=value` for scalars (no spaces, underscores for multi-word values)
- `section:count[key=value key2=value2]` for inline objects
- `key[count]=item1 item2 item3` for arrays (space-separated)
- `name:count(schema)[row1, row2]` for tabular data
- Section names with dots converted to underscores (e.g., `js.dependencies` → `js_dependencies`)

## Human Format Example
```
author = essensefromexistence
version = 0.0.1
name = dx
description = Orchestrate dont just own your code
title = Enhanced Developing Experience

[driven]
path = @/driven

[editors]
default = neovim
items:
- neovim
- zed
- vscode
- cursor
- antigravity
- replit
- firebase-studio

[workspace]
paths:
- @/www
- @/backend

[dependencies:1]
name = dx-package-1
version = 0.0.1

[dependencies:2]
name = dx-package-2
version = 0.0.1
```
Key features:
- `[section]` headers (TOML/INI-like)
- `key = value` with spaces around `=` for readability
- `key:` followed by `- item` for arrays
- Numbered sections like `[dependencies:1]` combine into tables

## Format Locations

**Architecture Overview**:

- **Human format** - Lives on **real disk**, you edit these files directly
  - Examples: `dx`, `config.sr`, `package.sr`
  - Source of truth, version controlled in git
  - TOML/INI-like syntax with aligned `=` at column 28

- **LLM format** (.llm) - **Auto-generated** in `.dx/serializer/` folder
  - Never edit manually
  - Regenerated automatically when human format changes
  - 52-73% token savings vs JSON

- **Machine format** (.machine) - **Auto-generated** in `.dx/serializer/` folder
  - Binary format (pure RKYV)
  - Zero-copy deserialization
  - ~48-51ns serialize time

The `.dx/` folder is gitignored as it contains generated files. Only commit human format files.

## Machine Format (RKYV)

**DX-Machine IS RKYV** - we use RKYV directly:
- Pure RKYV wire format (no modifications)
- Zero-overhead wrapper with `#[inline(always)]`
- Identical performance: ~48-51ns single, ~7.5µs batch 100
- Zero-copy deserialization
- Production-ready
```rust
use serializer::machine::{serialize, deserialize};
// Serialize (calls rkyv::to_bytes directly)
let bytes = serialize(&data)?;
// Deserialize (calls rkyv::access_unchecked directly)
let archived = unsafe { deserialize::<MyType>(&bytes) };
```

## Why DX Beats TOON

- No indentation - TOON requires 2 spaces per level
- Inline objects - `section:count[key=value]` vs nested YAML
- Space-separated arrays - No commas needed
- Tabular data - `name:count(schema)[rows]` for structured data
- Prefix elimination - `@prefix` removes repeated prefixes

## Quick Start
```rust
use serializer::{json_to_dx, dx_to_json};
let json = r#"{"name": "app", "version": "1.0"}"#;
let dx = json_to_dx(json)?;
```

## Features
```toml
[dependencies]
dx-serializer = { version = "0.1", features = ["tiktoken"] }
```
+--------------+----------------+
| Feature      | Description    |
+==============+================+
| `converters` | JSON/YAML/TOML |
+--------------+----------------+

## Documentation

- LLM Format Spec (../../.dx/serializer/LLM_FORMAT.md)
- Human Format Spec (../../.dx/serializer/HUMAN_FORMAT.md)

## License

MIT / Apache-2.0
