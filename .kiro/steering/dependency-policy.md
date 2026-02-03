---
title: Dependency Policy
inclusion: always
---

# Dependency Policy

## Version Selection

**Always use release candidate (RC) versions** when available for all crates in this project.

- Prefer `-rc` versions over stable releases
- Use the latest pre-release version (alpha, beta, rc) if no stable version exists
- Only fall back to stable versions when no pre-release is available

## Examples

```toml
# Good - using RC version
notify = "9.0.0-rc.1"

# Avoid - using stable when RC exists
notify = "8.2.0"
```

## Rationale

This project prioritizes staying on the cutting edge of the Rust ecosystem to benefit from the latest features, improvements, and bug fixes before they reach stable releases.
