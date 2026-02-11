//! DX Serializer CLI
//!
//! Processes .sr/.dx files and generates .llm and .machine outputs in .dx/serializer/

use serializer::{SerializerOutput, SerializerOutputConfig};
use std::env;
use std::path::Path;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: dx-serialize <file.dxs> [output_dir]");
        eprintln!("       dx-serialize --dir <directory> [output_dir]");
        eprintln!();
        eprintln!("Examples:");
        eprintln!("  dx-serialize crates/check/rules/javascript-lint.dxs");
        eprintln!("  dx-serialize --dir crates/check/rules");
        std::process::exit(1);
    }

    let output_dir = if args.len() >= 3 && args[1] != "--dir" {
        args[2].clone()
    } else if args.len() >= 4 && args[1] == "--dir" {
        args[3].clone()
    } else {
        ".dx/serializer".to_string()
    };

    let config = SerializerOutputConfig::new().with_output_dir(&output_dir);
    let serializer = SerializerOutput::with_config(config);

    if args[1] == "--dir" {
        if args.len() < 3 {
            eprintln!("Error: --dir requires a directory path");
            std::process::exit(1);
        }
        let dir = Path::new(&args[2]);
        match serializer.process_directory(dir) {
            Ok(results) => {
                println!("Processed {} files:", results.len());
                for result in results {
                    println!(
                        "  {} -> {}",
                        result.paths.source.display(),
                        result.paths.llm.display()
                    );
                    println!("    LLM: {} bytes", result.llm_size);
                    println!("    Machine: {} bytes", result.machine_size);
                }
            }
            Err(e) => {
                eprintln!("Error processing directory: {}", e);
                std::process::exit(1);
            }
        }
    } else {
        let source = Path::new(&args[1]);
        match serializer.process_file(source) {
            Ok(result) => {
                println!("Generated outputs for {}:", source.display());
                println!(
                    "  LLM:     {} ({} bytes)",
                    result.paths.llm.display(),
                    result.llm_size
                );
                println!(
                    "  Machine: {} ({} bytes)",
                    result.paths.machine.display(),
                    result.machine_size
                );
            }
            Err(e) => {
                eprintln!("Error: {}", e);
                std::process::exit(1);
            }
        }
    }
}
