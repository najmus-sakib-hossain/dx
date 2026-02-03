
# DX Serializer Syntax Reference

This document describes the two official formats for DX Serializer.

## LLM Format (Dx Serializer)

The LLM format is a compact, token-efficient format stored on disk.

### Objects

```dsr
name[key=value,key2=value2,key3=value3]
```
- Name followed by brackets containing comma-separated key=value pairs
- No spaces around `=` or `,`

### Arrays

Arrays are values without explicit keys after the first key:
```dsr
editors[items=neovim,zed,vscode,cursor,default=neovim]
```
Here `items` has values `neovim,zed,vscode,cursor` and `default` is `neovim`.

### Strings with Spaces

Use double quotes:
```dsr
config[title="Enhanced Developing Experience",desc="My description"]
```

### Nested Sections

Use dot notation in the section name:
```dsr
js.dependencies[react=19.0.1,next=16.0.1]
i18n.locales[path=@/locales,default=en-US]
```

### Complete Example

```dsr
config[name=dx,version=0.0.1,title="Enhanced Developing Experience"]
workspace[paths=@/www,@/backend]
editors[items=neovim,zed,vscode,default=neovim]
forge[repository=https://github.com/user/repo,tools=cli,docs,tests]
js.dependencies[react=19.0.1,next=16.0.1]
```

## Human Format

The Human format is designed for readability in text editors.

### Scalars

```dx
key = value ```
- Key followed by `=` and value
- Keys are padded with spaces for alignment
- Strings with spaces use quotes: `title = "My Title"`


### Arrays


```dx
key:
- item1
- item2
- item3
```
- Key followed by `:` on its own line
- Each item on a new line prefixed with `- `


### Sections


```dx
[section]
key = value
[section.subsection]
key = value ```
- Section headers in brackets
- Nested sections use dot notation

### Complete Example

```dx
name = dx version = 0.0.1 title = "Enhanced Developing Experience"
[workspace]
paths:
- @/www
- @/backend
[editors]
items:
- neovim
- zed
- vscode
default = neovim
[forge]
repository = https://github.com/user/repo tools:
- cli
- docs
- tests
[js.dependencies]
react = 19.0.1 next = 16.0.1 ```


## Conversion Rules



### LLM → Human


- `config[...]` becomes root-level key-value pairs (no section header)
- Other `name[...]` become `[name]` sections
- Comma-separated values after a key become array items with `-`
- Keys are padded for alignment


### Human → LLM


- Root-level key-value pairs become `config[...]`
- `[section]` headers become `section[...]`
- `key:` followed by `- item` lines become comma-separated values
- All whitespace padding is removed


## Grammar (EBNF)



### LLM Format


```ebnf
document = section* ;
section = identifier "[" pairs "]" ;
pairs = pair ("," pair)* ;
pair = key "=" value ;
key = identifier ;
value = string | identifier ("," identifier)* ;
string = '"' [^"]* '"' ;
identifier = [a-zA-Z_][a-zA-Z0-9_.-]* ;
```


### Human Format


```ebnf
document = (root_pair | section)* ;
root_pair = key "=" value | key ":" array_items ;
section = "[" identifier "]" section_content ;
section_content = (pair | array_def)* ;
pair = key "=" value ;
array_def = key ":" array_items ;
array_items = ("- " value)+ ;
key = identifier ;
value = string | identifier ;
string = '"' [^"]* '"' ;
identifier = [a-zA-Z_][a-zA-Z0-9_.-]* ;
```
