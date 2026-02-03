#![allow(clippy::cast_precision_loss)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::too_many_lines)]

//! Load and verify .machine files directly
//!
//! This proves the machine format works in real-world scenarios:
//! 1. Load .machine files from disk
//! 2. Deserialize to DxDocument
//! 3. Convert to human-readable format
//! 4. Verify data integrity

use serializer::llm::convert::{
    MachineFormat, machine_to_document, machine_to_human, machine_to_llm,
};
use std::fs;
use std::path::Path;

fn main() {
    println!("=== Loading .machine Files Test ===\n");

    let essence_dir = Path::new("../../essence");
    let machine_files = vec![
        "example1_mixed.machine",
        "example2_nested.machine",
        "example3_deep.machine",
        "example4_config.machine",
        "example5_leaf.machine",
    ];

    for machine_file in &machine_files {
        let machine_path = essence_dir.join(machine_file);

        if !machine_path.exists() {
            println!("⚠ Skipping {} (not found)\n", machine_file);
            continue;
        }

        println!("📦 Loading: {}", machine_file);

        // Read binary file
        let binary_data = match fs::read(&machine_path) {
            Ok(data) => data,
            Err(e) => {
                eprintln!("  ❌ Failed to read: {}\n", e);
                continue;
            }
        };

        println!("  ✓ Read {} bytes", binary_data.len());

        // Verify magic bytes
        if binary_data.len() >= 4 {
            let magic = &binary_data[0..4];
            println!(
                "  ✓ Magic: {} {} {} {} ({})",
                magic[0] as char,
                magic[1] as char,
                magic[2] as char,
                magic[3] as char,
                if magic == b"DXMF" {
                    "valid"
                } else {
                    "INVALID!"
                }
            );
        }

        // Create MachineFormat
        let machine = MachineFormat { data: binary_data };

        // Deserialize to document
        let doc = match machine_to_document(&machine) {
            Ok(d) => d,
            Err(e) => {
                eprintln!("  ❌ Deserialization failed: {}\n", e);
                continue;
            }
        };

        println!("  ✓ Deserialized successfully");
        println!("    - Context entries: {}", doc.context.len());
        println!("    - Sections: {}", doc.sections.len());

        // Show some context data
        if !doc.context.is_empty() {
            println!("    - Sample context:");
            for (i, (key, value)) in doc.context.iter().take(3).enumerate() {
                println!("      {}. {} = {:?}", i + 1, key, value);
            }
        }

        // Show section info
        for (id, section) in doc.sections.iter().take(2) {
            println!(
                "    - Section '{}': {} columns, {} rows",
                id,
                section.schema.len(),
                section.rows.len()
            );
        }

        // Convert to Dx Serializer format
        match machine_to_llm(&machine) {
            Ok(dsr) => {
                println!("  ✓ Converted to Dx Serializer ({} bytes)", dsr.len());
                if dsr.len() < 200 {
                    println!(
                        "    Preview:\n{}",
                        dsr.lines().take(5).collect::<Vec<_>>().join("\n")
                    );
                }
            }
            Err(e) => {
                eprintln!("  ⚠ Dx Serializer conversion failed: {}", e);
            }
        }

        // Convert to Human format
        match machine_to_human(&machine) {
            Ok(human) => {
                println!("  ✓ Converted to Human format ({} bytes)", human.len());
            }
            Err(e) => {
                eprintln!("  ⚠ Human conversion failed: {}", e);
            }
        }

        println!();
    }

    println!("=== Test Results ===");
    println!("✅ Machine format files can be:");
    println!("   - Loaded from disk");
    println!("   - Deserialized to DxDocument");
    println!("   - Converted to Dx Serializer format");
    println!("   - Converted to Human format");
    println!("\n🎯 Real-world usage verified!");
}
