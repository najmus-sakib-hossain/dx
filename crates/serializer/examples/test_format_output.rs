#![allow(clippy::cast_precision_loss)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::too_many_lines)]

/// Test dx-serializer format conversions and file output
/// Run with: cargo run --example `test_format_output` -p dx-serializer
use serializer::{
    DxArray, DxObject, DxValue, encode,
    llm::{DxDocument, DxLlmValue, DxSection, HumanFormatter, LlmSerializer},
};
use std::fs;
use std::path::Path;

fn main() {
    println!("\n╔══════════════════════════════════════════════════════════════╗");
    println!("║      DX-SERIALIZER: FORMAT CONVERSION TEST                  ║");
    println!("╚══════════════════════════════════════════════════════════════╝\n");

    // Create sample data
    let mut doc = DxDocument::new();

    // Root scalars
    doc.context
        .insert("name".to_string(), DxLlmValue::Str("dx-test-project".to_string()));
    doc.context.insert("version".to_string(), DxLlmValue::Str("1.0.0".to_string()));
    doc.context.insert(
        "description".to_string(),
        DxLlmValue::Str("Testing DX serializer formats".to_string()),
    );

    // Array
    doc.context.insert(
        "tags".to_string(),
        DxLlmValue::Arr(vec![
            DxLlmValue::Str("rust".to_string()),
            DxLlmValue::Str("serialization".to_string()),
            DxLlmValue::Str("performance".to_string()),
        ]),
    );

    // Table section
    let mut section =
        DxSection::new(vec!["id".to_string(), "name".to_string(), "version".to_string()]);
    section.rows.push(vec![
        DxLlmValue::Num(1.0),
        DxLlmValue::Str("dx-core".to_string()),
        DxLlmValue::Str("1.0.0".to_string()),
    ]);
    section.rows.push(vec![
        DxLlmValue::Num(2.0),
        DxLlmValue::Str("dx-cli".to_string()),
        DxLlmValue::Str("1.0.0".to_string()),
    ]);
    doc.sections.insert('d', section);

    // ═══════════════════════════════════════════════════════════════
    // 1. LLM FORMAT (.sr)
    // ═══════════════════════════════════════════════════════════════
    println!("1️⃣  Generating LLM format (.sr)...");

    let serializer = LlmSerializer::new();
    let llm_output = serializer.serialize(&doc);

    let sr_path = "test.sr";
    fs::write(sr_path, &llm_output).expect("Failed to write .sr file");

    println!("   ✅ Written to: {sr_path}");
    println!("   📊 Size: {} bytes", llm_output.len());
    println!("   📝 Content preview:");
    for line in llm_output.lines().take(5) {
        println!("      {line}");
    }
    println!();

    // ═══════════════════════════════════════════════════════════════
    // 2. HUMAN FORMAT (.human)
    // ═══════════════════════════════════════════════════════════════
    println!("2️⃣  Generating Human format (.human)...");

    let formatter = HumanFormatter::new();
    let human_output = formatter.format(&doc);

    let human_path = "test.human";
    fs::write(human_path, &human_output).expect("Failed to write .human file");

    println!("   ✅ Written to: {human_path}");
    println!("   📊 Size: {} bytes", human_output.len());
    println!("   📝 Content preview:");
    for line in human_output.lines().take(8) {
        println!("      {line}");
    }
    println!();

    // ═══════════════════════════════════════════════════════════════
    // 3. MACHINE FORMAT (.machine)
    // ═══════════════════════════════════════════════════════════════
    println!("3️⃣  Generating Machine format (.machine)...");

    // Create DxValue for binary encoding
    let mut obj = DxObject::new();
    obj.insert("name".to_string(), DxValue::String("dx-test-project".to_string()));
    obj.insert("version".to_string(), DxValue::String("1.0.0".to_string()));
    obj.insert(
        "description".to_string(),
        DxValue::String("Testing DX serializer formats".to_string()),
    );
    obj.insert(
        "tags".to_string(),
        DxValue::Array(DxArray {
            values: vec![
                DxValue::String("rust".to_string()),
                DxValue::String("serialization".to_string()),
                DxValue::String("performance".to_string()),
            ],
            is_stream: false,
        }),
    );

    match encode(&DxValue::Object(obj)) {
        Ok(binary) => {
            let machine_path = "test.machine";
            fs::write(machine_path, &binary).expect("Failed to write .machine file");

            println!("   ✅ Written to: {machine_path}");
            println!("   📊 Size: {} bytes", binary.len());
            println!(
                "   🔢 Binary header: {:02X} {:02X} {:02X} {:02X}",
                binary.first().unwrap_or(&0),
                binary.get(1).unwrap_or(&0),
                binary.get(2).unwrap_or(&0),
                binary.get(3).unwrap_or(&0)
            );
        }
        Err(e) => {
            println!("   ❌ Error encoding: {e:?}");
        }
    }
    println!();

    // ═══════════════════════════════════════════════════════════════
    // VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    println!("╔══════════════════════════════════════════════════════════════╗");
    println!("║                      VERIFICATION                            ║");
    println!("╚══════════════════════════════════════════════════════════════╝\n");

    let files = vec![
        ("test.sr", "LLM format"),
        ("test.human", "Human format"),
        ("test.machine", "Machine format"),
    ];

    let mut all_exist = true;
    for (file, desc) in &files {
        if Path::new(file).exists() {
            let metadata = fs::metadata(file).unwrap();
            println!("✅ {} - {} ({} bytes)", file, desc, metadata.len());
        } else {
            println!("❌ {file} - NOT FOUND");
            all_exist = false;
        }
    }

    println!();
    if all_exist {
        println!("🎉 SUCCESS! All format files created successfully!");
        println!("\n📁 Files created in root directory:");
        println!("   • test.sr      - Token-optimized for LLMs");
        println!("   • test.human   - Human-readable for editing");
        println!("   • test.machine - Binary for zero-copy access");
    } else {
        println!("⚠️  Some files were not created!");
    }

    println!("\n💡 Tip: Check the files in your root directory!");
}
