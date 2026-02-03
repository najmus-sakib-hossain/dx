//! Initialize DX in current directory

use colored::Colorize;

pub async fn run() -> anyhow::Result<()> {
    println!("{} Initializing DX in current directory...", "🚀".bright_cyan());
    println!();
    
    // Create .dx directory structure
    let dirs = [
        ".dx",
        ".dx/integrations",
        ".dx/skills",
        ".dx/plugins",
        ".dx/serializer",
        ".dx/wasm-cache",
    ];
    
    for dir in dirs {
        std::fs::create_dir_all(dir)?;
        println!("  {} Created: {}", "✓".bright_green(), dir);
    }
    
    // Create default configuration
    let config = r#"# DX Configuration
# This file configures the DX Agent for this workspace

# Agent settings
[agent]
auto_start = false
auto_pr = true
max_concurrent_tasks = 10

# LLM settings
[llm]
provider = "anthropic"
model = "claude-sonnet-4-20250514"
# api_key = "sk-..." # Set via DX_API_KEY env var

# Default integrations to enable
[integrations]
browser = true
github = false
telegram = false
notion = false
spotify = false

# Scheduled tasks
# [tasks.check_email]
# cron = "0 * * * *"
# skill = "check_email"
# context = "count=10"
"#;
    
    std::fs::write(".dx/config.sr", config)?;
    println!("  {} Created: .dx/config.sr", "✓".bright_green());
    
    // Create .gitignore for .dx
    let gitignore = r#"# DX generated files
serializer/
wasm-cache/
*.machine
*.llm
"#;
    
    std::fs::write(".dx/.gitignore", gitignore)?;
    println!("  {} Created: .dx/.gitignore", "✓".bright_green());
    
    println!();
    println!("{} DX initialized!", "✅".bright_green());
    println!();
    println!("  Next steps:");
    println!("    1. {} Set your API key: {}", "→".bright_cyan(), "export DX_API_KEY=your-key".bright_blue());
    println!("    2. {} Connect integrations: {}", "→".bright_cyan(), "dx connect github".bright_blue());
    println!("    3. {} Start the agent: {}", "→".bright_cyan(), "dx agent start".bright_blue());
    println!("    4. {} Run commands: {}", "→".bright_cyan(), "dx run \"check my emails\"".bright_blue());
    println!();
    println!("  {} DX Serializer saves 52-73% tokens vs JSON!", "💡".bright_yellow());
    println!("  {} Create integrations in any language with WASM!", "💡".bright_yellow());
    println!("  {} Auto-PR shares your integrations with the community!", "💡".bright_yellow());
    
    Ok(())
}
