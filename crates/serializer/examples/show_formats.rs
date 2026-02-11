#![allow(clippy::cast_precision_loss)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::too_many_lines)]

/// Show current dx-serializer formats
/// Run with: cargo run --example show_formats -p dx-serializer
use serializer::{
    encode,
    llm::{DxDocument, DxLlmValue, DxSection, HumanFormatter, LlmSerializer},
    DxArray, DxObject, DxValue,
};

fn main() {
    println!("\n╔══════════════════════════════════════════════════════════════╗");
    println!("║         DX-SERIALIZER: CURRENT FORMAT OUTPUT                ║");
    println!("╚══════════════════════════════════════════════════════════════╝\n");

    // Create sample data
    let mut doc = DxDocument::new();

    // Context (simple key-value pairs)
    doc.context.insert(
        "task".to_string(),
        DxLlmValue::Str("Our favorite hikes together".to_string()),
    );
    doc.context.insert(
        "location".to_string(),
        DxLlmValue::Str("Boulder".to_string()),
    );
    doc.context.insert(
        "season".to_string(),
        DxLlmValue::Str("spring_2025".to_string()),
    );

    // Array
    doc.context.insert(
        "friends".to_string(),
        DxLlmValue::Arr(vec![
            DxLlmValue::Str("ana".to_string()),
            DxLlmValue::Str("luis".to_string()),
            DxLlmValue::Str("sam".to_string()),
        ]),
    );

    // Table section
    let mut section = DxSection::new(vec![
        "id".to_string(),
        "name".to_string(),
        "distanceKm".to_string(),
        "elevationGain".to_string(),
        "companion".to_string(),
        "wasSunny".to_string(),
    ]);
    section.rows.push(vec![
        DxLlmValue::Num(1.0),
        DxLlmValue::Str("Blue Lake Trail".to_string()),
        DxLlmValue::Num(7.5),
        DxLlmValue::Num(320.0),
        DxLlmValue::Str("ana".to_string()),
        DxLlmValue::Bool(true),
    ]);
    section.rows.push(vec![
        DxLlmValue::Num(2.0),
        DxLlmValue::Str("Ridge Overlook".to_string()),
        DxLlmValue::Num(9.2),
        DxLlmValue::Num(540.0),
        DxLlmValue::Str("luis".to_string()),
        DxLlmValue::Bool(false),
    ]);
    section.rows.push(vec![
        DxLlmValue::Num(3.0),
        DxLlmValue::Str("Wildflower Loop".to_string()),
        DxLlmValue::Num(5.1),
        DxLlmValue::Num(180.0),
        DxLlmValue::Str("sam".to_string()),
        DxLlmValue::Bool(true),
    ]);
    doc.sections.insert('a', section);

    // ═══════════════════════════════════════════════════════════════
    // LLM FORMAT (Dx Serializer)
    // ═══════════════════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════════════════");
    println!("                    1. LLM FORMAT (Dx Serializer)                        ");
    println!("═══════════════════════════════════════════════════════════════\n");

    let serializer = LlmSerializer::new();
    let llm_output = serializer.serialize(&doc);

    println!("{}", llm_output);
    println!("\n📊 Size: {} bytes\n", llm_output.len());

    // ═══════════════════════════════════════════════════════════════
    // HUMAN FORMAT
    // ═══════════════════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════════════════");
    println!("                    2. HUMAN FORMAT                            ");
    println!("═══════════════════════════════════════════════════════════════\n");

    let formatter = HumanFormatter::new();
    let human_output = formatter.format(&doc);

    println!("{}", human_output);
    println!("\n📊 Size: {} bytes\n", human_output.len());

    // ═══════════════════════════════════════════════════════════════
    // MACHINE FORMAT (Binary)
    // ═══════════════════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════════════════");
    println!("                    3. MACHINE FORMAT (Binary)                 ");
    println!("═══════════════════════════════════════════════════════════════\n");

    // Create a simple DxValue for binary encoding
    let mut obj = DxObject::new();
    obj.insert(
        "task".to_string(),
        DxValue::String("Our favorite hikes together".to_string()),
    );
    obj.insert(
        "location".to_string(),
        DxValue::String("Boulder".to_string()),
    );
    obj.insert(
        "season".to_string(),
        DxValue::String("spring_2025".to_string()),
    );
    obj.insert(
        "friends".to_string(),
        DxValue::Array(DxArray {
            values: vec![
                DxValue::String("ana".to_string()),
                DxValue::String("luis".to_string()),
                DxValue::String("sam".to_string()),
            ],
            is_stream: false,
        }),
    );

    match encode(&DxValue::Object(obj)) {
        Ok(binary) => {
            println!(
                "Binary header: {:02X} {:02X} {:02X} {:02X}",
                binary.get(0).unwrap_or(&0),
                binary.get(1).unwrap_or(&0),
                binary.get(2).unwrap_or(&0),
                binary.get(3).unwrap_or(&0)
            );
            println!("Total size: {} bytes", binary.len());
            println!("\nFirst 32 bytes (hex):");
            for (i, byte) in binary.iter().take(32).enumerate() {
                print!("{:02X} ", byte);
                if (i + 1) % 16 == 0 {
                    println!();
                }
            }
            println!("\n");
        }
        Err(e) => println!("Error encoding: {:?}", e),
    }

    // ═══════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════
    println!("═══════════════════════════════════════════════════════════════");
    println!("                         SUMMARY                               ");
    println!("═══════════════════════════════════════════════════════════════\n");

    println!("Format      │ Purpose              │ File Extension");
    println!("────────────┼──────────────────────┼───────────────");
    println!("LLM (Dx Serializer)   │ Token-efficient      │ .sr and dx");
    println!("Human       │ Readable/editable    │ .human");
    println!("Machine     │ Binary, zero-copy    │ .machine");
}
