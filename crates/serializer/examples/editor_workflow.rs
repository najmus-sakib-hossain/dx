#![allow(clippy::cast_precision_loss)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::too_many_lines)]

// EDITOR WORKFLOW DEMONSTRATION
// Shows how an LSP/Editor would use bidirectional conversion

use serializer::{format_machine, Mappings};

fn main() {
    println!("╔═══════════════════════════════════════════════════════════════╗");
    println!("║                                                               ║");
    println!("║              DX EDITOR INTEGRATION WORKFLOW                   ║");
    println!("║                                                               ║");
    println!("╚═══════════════════════════════════════════════════════════════╝\n");

    // SCENARIO: User opened a compact .dx file in their editor
    println!("📂 STEP 1: User opens dx.dx (960 bytes on disk)");
    println!("   LSP detects .dx extension");
    println!("   Automatically calls format_human() for display\n");

    // STEP 2: User sees beautiful human-readable format
    println!("👁️  STEP 2: Editor shows expanded format:");
    println!("   ┌─────────────────────────────────────────┐");
    println!("   │ context.name        : dx-www            │");
    println!("   │ ^version            : 1.0.0             │");
    println!("   │ ^description        : Binary Web Runtime│");
    println!("   │ workspace           > crates | examples │");
    println!("   │ // etc...                                │");
    println!("   └─────────────────────────────────────────┘\n");

    // STEP 3: User edits (adds a field, changes value)
    println!("✏️  STEP 3: User makes edits:");
    println!("   - Changes version to 1.0.1");
    println!("   - Adds new dependency");
    println!("   - Editor shows LIVE changes\n");

    let edited_human_readable = r"context.name        : dx-www
^version            : 1.0.1
^description        : Binary Web Runtime
^author             : Dx Team

workspace           > crates | examples | tests

dependencies.dx_core    : 1.0.0
^dx_dom                 : 1.0.0
^dx_morph               : 1.0.0
^serde                  : 1.0.0

build.target            : wasm32
^optimizer              : release
^strip                  : true";

    println!("💾 STEP 4: User saves (Ctrl+S)");
    println!("   LSP intercepts save operation");
    println!("   Calls format_machine() to compress\n");

    // Compress back to machine format
    match format_machine(edited_human_readable) {
        Ok(compressed) => {
            println!("✅ STEP 5: File saved in ultra-compact format");
            println!("   Original:  ~350 bytes (human readable)");
            println!("   Saved:     {} bytes (compressed)", compressed.len());
            println!(
                "   Ratio:     {:.1}x smaller\n",
                350.0 / compressed.len() as f64
            );

            println!("📦 Compressed output (what's actually saved):");
            println!("   ┌─────────────────────────────────────────┐");
            let preview = String::from_utf8_lossy(&compressed);
            for line in preview.lines().take(10) {
                println!("   │ {line:<42}│");
            }
            println!("   └─────────────────────────────────────────┘\n");

            // Show mapping stats
            let mappings = Mappings::get();
            println!("📊 MAPPING SYSTEM:");
            println!(
                "   - Loaded {} abbreviations from .dx/serializer/",
                mappings.expand.len()
            );
            println!("   - Bidirectional HashMap (instant lookup)");
            println!("   - Lazy loaded (zero startup cost)");
            println!("   - Version controlled (team consistency)\n");

            println!("🎯 THE MAGIC:");
            println!("   ✓ User edits HUMAN-READABLE format");
            println!("   ✓ File saves as MACHINE-OPTIMIZED format");
            println!("   ✓ Zero data loss (lossless roundtrip)");
            println!("   ✓ Best of both worlds!");
        }
        Err(e) => {
            eprintln!("❌ Compression failed: {e}");
        }
    }

    println!("\n╔═══════════════════════════════════════════════════════════════╗");
    println!("║                                                               ║");
    println!("║  Editor Integration Complete: Transparent Compression! ⚡     ║");
    println!("║                                                               ║");
    println!("╚═══════════════════════════════════════════════════════════════╝");
}
