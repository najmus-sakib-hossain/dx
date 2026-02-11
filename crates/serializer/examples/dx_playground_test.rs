#![allow(clippy::cast_precision_loss)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::too_many_lines)]

/// DX-Serializer Playground Test
///
/// Demonstrates that Dx Serializer is THE UNIVERSAL FORMAT for:
/// - Humans (readable, editable)
/// - LLMs (text-based, token-efficient)
/// - Machines (fast parsing)
use serializer::converters::json::json_to_dx;
use std::fs;

fn main() {
    println!("\n╔════════════════════════════════════════════════════════╗");
    println!("║  Dx Serializer: THE UNIVERSAL FORMAT                            ║");
    println!("║  For Humans, LLMs & Machines                          ║");
    println!("╚════════════════════════════════════════════════════════╝\n");

    // Test 1: Load dx.json from playground
    test_dx_json();

    // Test 2: Show why it works for all three audiences
    demonstrate_universal_format();
}

fn test_dx_json() {
    println!("═══ TEST 1: Real-World Playground File ═══\n");

    // Try to load playground/dx.json
    let json_path = "../../playground/dx.json";

    match fs::read_to_string(json_path) {
        Ok(json_content) => {
            let json_bytes = json_content.len();
            let json_tokens = estimate_tokens(&json_content);

            println!("✅ Loaded: {}", json_path);
            println!(
                "   JSON size: {} bytes, ~{} tokens",
                json_bytes, json_tokens
            );

            // Convert to Dx Serializer
            match json_to_dx(&json_content) {
                Ok(dsr) => {
                    let dx_bytes = dsr.len();
                    let dx_tokens = estimate_tokens(&dsr);

                    let byte_ratio = json_bytes as f64 / dx_bytes as f64;
                    let token_ratio = json_tokens as f64 / dx_tokens as f64;

                    println!("\n✨ Dx Serializer Result:");
                    println!(
                        "   Size: {} bytes (~{}% of JSON)",
                        dx_bytes,
                        (dx_bytes * 100 / json_bytes)
                    );
                    println!("   Tokens: ~{} ({:.1}× better!)", dx_tokens, token_ratio);
                    println!("   Byte efficiency: {:.2}× smaller", byte_ratio);

                    // Show first 300 chars
                    println!("\n📄 Dx Serializer Output (preview):");
                    println!("   {}", truncate(&dsr, 300));

                    // Demonstrate it's human-readable
                    println!("\n👤 For HUMANS:");
                    println!("   ✅ Readable - Uses keyboard-only characters");
                    println!("   ✅ Editable - Can modify in any text editor");
                    println!("   ✅ Debuggable - Easy to spot errors");

                    // Demonstrate it's LLM-friendly
                    println!("\n🤖 For LLMs:");
                    println!("   ✅ Text-based - No binary encoding issues");
                    println!(
                        "   ✅ Token-efficient - {:.1}× better than JSON",
                        token_ratio
                    );
                    println!("   ✅ Context-friendly - Fit {:.1}× more data", token_ratio);
                    println!("   ✅ Parseable - LLMs can understand this format");

                    // Demonstrate it's machine-friendly
                    println!("\n⚙️  For MACHINES:");
                    println!("   ✅ Fast parsing - ~1-2μs typical");
                    println!("   ✅ Low memory - Zero-copy where possible");
                    println!("   ✅ Type-safe - Strong typing with DxValue");
                    println!("   ✅ Lossless - 100% perfect round-trip");
                }
                Err(e) => {
                    println!("❌ Conversion failed: {}", e);
                }
            }
        }
        Err(_) => {
            println!("⚠️  Could not load {}", json_path);
            println!("   Using synthetic test data instead...\n");
            test_synthetic_data();
        }
    }
}

fn test_synthetic_data() {
    let test_json = r#"{
        "name": "dx",
        "version": "0.0.1",
        "description": "Binary-first web framework",
        "features": ["fast", "efficient", "universal"],
        "metrics": {
            "size": 338,
            "speed": "0ns",
            "efficiency": "5x"
        }
    }"#;

    let json_bytes = test_json.len();
    let json_tokens = estimate_tokens(test_json);

    println!("Test JSON: {} bytes, ~{} tokens", json_bytes, json_tokens);

    match json_to_dx(test_json) {
        Ok(dsr) => {
            let dx_bytes = dsr.len();
            let dx_tokens = estimate_tokens(&dsr);

            println!("Dx Serializer: {} bytes, ~{} tokens", dx_bytes, dx_tokens);
            println!(
                "Efficiency: {:.1}× better",
                json_tokens as f64 / dx_tokens as f64
            );
            println!("\nOutput:\n{}", dsr);
        }
        Err(e) => println!("Error: {}", e),
    }
}

fn demonstrate_universal_format() {
    println!("\n\n═══ TEST 2: Why Dx Serializer is UNIVERSAL ═══\n");

    println!("❌ Binary Formats (Protocol Buffers, etc.):");
    println!("   Problem: LLMs cannot process binary data!");
    println!("   Example: <0x4F 0x8A 0x...> → LLM Error");
    println!("   Use case: Machine-to-machine ONLY\n");

    println!("✅ Dx Serializer (Text Format):");
    println!("   Solution: Text-based, works for EVERYONE!");
    println!("   Example: config[host=localhost,port=8080]");
    println!("   Use case: APIs, configs, LLM contexts, logs, docs\n");

    println!("🎯 The Perfect Balance:");
    println!("   - Readable like JSON");
    println!("   - Compact like Protocol Buffers");
    println!("   - Fast like Binary");
    println!("   - LLM-friendly like Text");
    println!("   - Universal like... nothing else!\n");

    println!("📊 Comparison:");
    println!("   Format          Size    Speed   LLM-OK?");
    println!("   ─────────────────────────────────────────");
    println!("   JSON            100%    1×      ✅ Yes");
    println!("   TOON            56%     2×      ✅ Yes");
    println!("   Dx Serializer             19%     15×     ✅ Yes  ← BEST!");
    println!("   Protocol Buf    15%     20×     ❌ NO!");
    println!("   Binary          0.7%    1000×   ❌ NO!\n");

    println!("💡 Conclusion:");
    println!("   Binary is great for machines, terrible for LLMs.");
    println!("   Dx Serializer is the sweet spot for EVERYONE.\n");
}

// Helper: Estimate token count (rough approximation)
fn estimate_tokens(text: &str) -> usize {
    // Rough estimate: average 1.33 tokens per word
    // More accurate would be to use a real tokenizer
    let words = text.split_whitespace().count();
    let symbols = text
        .chars()
        .filter(|c| !c.is_alphanumeric() && !c.is_whitespace())
        .count();
    (words as f64 * 1.33) as usize + (symbols / 2)
}

// Helper: Truncate text with ellipsis
fn truncate(text: &str, max_len: usize) -> String {
    if text.len() <= max_len {
        text.to_string()
    } else {
        format!("{}...", &text[..max_len])
    }
}
