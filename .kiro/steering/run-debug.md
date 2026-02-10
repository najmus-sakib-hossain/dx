---
inclusion: manual
---

# Run Debug Mode

## Quick Commands

When the user asks to run, test, or start the icon search app, use these commands:

### Run the Icon Search App (Debug Mode)
```bash
cargo run --manifest-path crates/app/Cargo.toml
```

### Run with Cargo Watch (Auto-reload on changes)
```bash
cargo watch -x "run --manifest-path crates/app/Cargo.toml"
```

### Build Only (No Run)
```bash
cargo build --manifest-path crates/app/Cargo.toml
```

### Release Mode (Optimized)
```bash
cargo run --release --manifest-path crates/app/Cargo.toml
```

## Important Notes

- **Debug mode** is the default and includes debug symbols for better error messages
- **Don't run `cargo build` repeatedly** - use `cargo watch` for development
- The app is located in `crates/app/` directory
- Project root detection happens automatically (looks for Cargo.toml + apps + crates folders)

## Troubleshooting

If the app fails to start:
1. Check that icon data exists in `apps/www/public/icons/` or `crates/icon/data/`
2. Verify GPUI dependencies are properly installed
3. Check terminal output for specific error messages

## Performance Tips

- Use `cargo run` for quick testing
- Use `cargo watch` during active development
- Use `cargo run --release` for performance testing
- The app now uses SVG caching, so first load may be slower but subsequent navigation is fast
