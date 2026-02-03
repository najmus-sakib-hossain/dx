//! List integrations, skills, tasks

use colored::Colorize;
use crate::ListCommands;

pub async fn run(what: ListCommands) -> anyhow::Result<()> {
    match what {
        ListCommands::Integrations => {
            println!("{} Available Integrations", "🔗".bright_cyan());
            println!();
            
            println!("  {} {}", "●".bright_green(), "github".bright_white());
            println!("    Capabilities: create_pr, create_issue, list_repos");
            println!("    Status: Connected");
            println!();
            
            println!("  {} {}", "●".bright_green(), "telegram".bright_white());
            println!("    Capabilities: send_message, receive_message, send_file");
            println!("    Status: Connected");
            println!();
            
            println!("  {} {}", "○".bright_yellow(), "discord".bright_white());
            println!("    Capabilities: send_message, manage_channels");
            println!("    Status: Not connected");
            println!();
            
            println!("  {} {}", "○".bright_yellow(), "notion".bright_white());
            println!("    Capabilities: create_page, query_database");
            println!("    Status: Not connected");
            println!();
            
            println!("  {} {}", "○".bright_yellow(), "spotify".bright_white());
            println!("    Capabilities: play, pause, next, search");
            println!("    Status: Not connected");
            println!();
            
            println!("  {} {}", "●".bright_green(), "browser".bright_white());
            println!("    Capabilities: navigate, click, type, screenshot");
            println!("    Status: Ready");
            println!();
            
            println!("  To connect: {} dx connect <integration>", "→".bright_cyan());
        }
        
        ListCommands::Skills => {
            println!("{} Available Skills", "🎯".bright_cyan());
            println!();
            
            let skills = [
                ("send_message", "Send messages via any messaging platform"),
                ("create_todo", "Create todos in Notion"),
                ("check_email", "Check and summarize emails"),
                ("browse_web", "Browse a webpage and extract content"),
                ("run_command", "Execute shell commands"),
                ("create_integration", "Create new integrations dynamically"),
                ("play_music", "Control Spotify playback"),
                ("create_pr", "Create GitHub pull requests"),
            ];
            
            for (name, desc) in skills {
                println!("  {} {}", "•".bright_cyan(), name.bright_white());
                println!("    {}", desc.bright_black());
            }
            
            println!();
            println!("  To use: {} dx run \"<skill_name> <params>\"", "→".bright_cyan());
            println!("  Or natural language: {} dx run \"send john a message on whatsapp\"", "→".bright_cyan());
        }
        
        ListCommands::Tasks => {
            println!("{} Scheduled Tasks", "📅".bright_cyan());
            println!();
            
            println!("  {} {}", "●".bright_green(), "check_email".bright_white());
            println!("    Schedule: Every hour");
            println!("    Skill: check_email");
            println!("    Last run: 45 minutes ago");
            println!();
            
            println!("  {} {}", "●".bright_green(), "daily_summary".bright_white());
            println!("    Schedule: Every day at 9:00 AM");
            println!("    Skill: browse_web");
            println!("    Last run: 2 hours ago");
            println!();
            
            println!("  {} {}", "●".bright_green(), "weekly_review".bright_white());
            println!("    Schedule: Every Sunday at 6:00 PM");
            println!("    Skill: create_todo");
            println!("    Last run: 5 days ago");
            println!();
            
            println!("  To add: {} dx schedule add <name> --cron \"0 * * * *\" --skill <skill>", "→".bright_cyan());
        }
        
        ListCommands::Plugins => {
            println!("{} Loaded Plugins", "🔌".bright_cyan());
            println!();
            
            println!("  No custom plugins loaded.");
            println!();
            println!("  To create: {} dx create plugin <name>", "→".bright_cyan());
            println!("  To create integration: {} dx create integration <name> --language python", "→".bright_cyan());
        }
    }
    
    Ok(())
}
