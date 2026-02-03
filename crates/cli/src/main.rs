//! # DX CLI - AGI-like AI Agent
//!
//! The main entry point for DX - an AGI-like AI Agent that can:
//! - Connect to ANY app (WhatsApp, Telegram, Discord, GitHub, Notion, Spotify, etc.)
//! - Create its own integrations dynamically via WASM compilation
//! - Auto-update itself by detecting local changes and creating PRs
//! - Run 24/7 as a daemon with minimal CPU usage
//! - Save 70%+ tokens using DX Serializer LLM format
//!
//! ## Quick Start
//!
//! ```bash
//! # Start the agent daemon
//! dx agent start
//!
//! # Connect to an integration
//! dx connect github
//! dx connect telegram
//! dx connect notion
//!
//! # Create a new integration dynamically
//! dx create integration my-api --language python
//!
//! # List available skills
//! dx skills list
//!
//! # Execute a skill
//! dx run "send a message to john on whatsapp saying hello"
//! ```

use clap::{Parser, Subcommand};
use colored::Colorize;
use tracing::Level;
use tracing_subscriber::FmtSubscriber;

mod commands;

/// DX CLI - AGI-like AI Agent
#[derive(Parser)]
#[command(name = "dx")]
#[command(author = "DX Team")]
#[command(version = "0.1.0")]
#[command(about = "🤖 DX - AGI-like AI Agent that connects to any app", long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    /// Enable verbose logging
    #[arg(short, long, global = true)]
    verbose: bool,
    
    /// Use JSON output
    #[arg(long, global = true)]
    json: bool,
    
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start, stop, or manage the agent daemon
    Agent {
        #[command(subcommand)]
        action: AgentCommands,
    },
    
    /// Connect to an integration (github, telegram, notion, etc.)
    Connect {
        /// Integration name
        integration: String,
        
        /// API token (optional, will prompt if not provided)
        #[arg(short, long)]
        token: Option<String>,
    },
    
    /// Disconnect from an integration
    Disconnect {
        /// Integration name
        integration: String,
    },
    
    /// Create new integrations, skills, or plugins
    Create {
        #[command(subcommand)]
        what: CreateCommands,
    },
    
    /// List integrations, skills, or tasks
    List {
        #[command(subcommand)]
        what: ListCommands,
    },
    
    /// Manage skills
    Skills {
        #[command(subcommand)]
        action: SkillsCommands,
    },
    
    /// Run a natural language command
    Run {
        /// The command to run (natural language)
        #[arg(trailing_var_arg = true)]
        command: Vec<String>,
    },
    
    /// Schedule tasks
    Schedule {
        #[command(subcommand)]
        action: ScheduleCommands,
    },
    
    /// Serializer commands (convert to/from DX format)
    Serializer {
        #[command(subcommand)]
        action: SerializerCommands,
    },
    
    /// Show status of the agent and integrations
    Status,
    
    /// Initialize DX in the current directory
    Init,
}

#[derive(Subcommand)]
pub enum AgentCommands {
    /// Start the agent daemon
    Start {
        /// Run in foreground (don't daemonize)
        #[arg(short, long)]
        foreground: bool,
    },
    /// Stop the agent daemon
    Stop,
    /// Restart the agent daemon
    Restart,
    /// Show agent status
    Status,
    /// View agent logs
    Logs {
        /// Number of lines to show
        #[arg(short, long, default_value = "50")]
        lines: usize,
        
        /// Follow the log output
        #[arg(short, long)]
        follow: bool,
    },
}

#[derive(Subcommand)]
pub enum CreateCommands {
    /// Create a new integration
    Integration {
        /// Integration name
        name: String,
        
        /// Programming language (python, javascript, go, rust)
        #[arg(short, long, default_value = "python")]
        language: String,
        
        /// Source file (optional, will use template if not provided)
        #[arg(short, long)]
        source: Option<String>,
    },
    /// Create a new skill
    Skill {
        /// Skill name
        name: String,
        
        /// Skill description
        #[arg(short, long)]
        description: Option<String>,
    },
    /// Create a new plugin
    Plugin {
        /// Plugin name
        name: String,
    },
}

#[derive(Subcommand)]
pub enum ListCommands {
    /// List available integrations
    Integrations,
    /// List available skills
    Skills,
    /// List scheduled tasks
    Tasks,
    /// List loaded plugins
    Plugins,
}

#[derive(Subcommand)]
pub enum SkillsCommands {
    /// List all skills
    List,
    /// Show skill details
    Show {
        /// Skill name
        name: String,
    },
    /// Add a new skill
    Add {
        /// Path to skill definition (.sr file)
        path: String,
    },
    /// Remove a skill
    Remove {
        /// Skill name
        name: String,
    },
}

#[derive(Subcommand)]
pub enum ScheduleCommands {
    /// Add a scheduled task
    Add {
        /// Task name
        name: String,
        
        /// Cron expression
        #[arg(short, long)]
        cron: String,
        
        /// Skill to execute
        #[arg(short, long)]
        skill: String,
        
        /// Skill context
        #[arg(long)]
        context: Option<String>,
    },
    /// Remove a scheduled task
    Remove {
        /// Task name
        name: String,
    },
    /// List scheduled tasks
    List,
}

#[derive(Subcommand)]
pub enum SerializerCommands {
    /// Convert JSON to DX format
    FromJson {
        /// Input file or stdin
        input: Option<String>,
        
        /// Output file (default: stdout)
        #[arg(short, long)]
        output: Option<String>,
    },
    /// Convert DX format to JSON
    ToJson {
        /// Input file or stdin
        input: Option<String>,
        
        /// Output file (default: stdout)
        #[arg(short, long)]
        output: Option<String>,
    },
    /// Process a file (generate .llm and .machine formats)
    Process {
        /// Input file or directory
        path: String,
        
        /// Recursive processing
        #[arg(short, long)]
        recursive: bool,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    
    // Set up logging
    let level = if cli.verbose { Level::DEBUG } else { Level::INFO };
    FmtSubscriber::builder()
        .with_max_level(level)
        .with_target(false)
        .compact()
        .init();
    
    // Print banner
    if !cli.json {
        print_banner();
    }
    
    match cli.command {
        Commands::Agent { action } => commands::agent::run(action).await?,
        Commands::Connect { integration, token } => {
            commands::connect::run(&integration, token.as_deref()).await?
        }
        Commands::Disconnect { integration } => {
            commands::disconnect::run(&integration).await?
        }
        Commands::Create { what } => commands::create::run(what).await?,
        Commands::List { what } => commands::list::run(what).await?,
        Commands::Skills { action } => commands::skills::run(action).await?,
        Commands::Run { command } => {
            let cmd = command.join(" ");
            commands::run::run(&cmd).await?
        }
        Commands::Schedule { action } => commands::schedule::run(action).await?,
        Commands::Serializer { action } => commands::serializer::run(action).await?,
        Commands::Status => commands::status::run().await?,
        Commands::Init => commands::init::run().await?,
    }
    
    Ok(())
}

fn print_banner() {
    println!();
    println!("{}", "╔═══════════════════════════════════════════════════════════════╗".bright_cyan());
    println!("{}", "║                                                               ║".bright_cyan());
    println!("{}", "║   ██████╗ ██╗  ██╗     █████╗  ██████╗ ███████╗███╗   ██╗████████╗  ║".bright_cyan());
    println!("{}", "║   ██╔══██╗╚██╗██╔╝    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝  ║".bright_cyan());
    println!("{}", "║   ██║  ██║ ╚███╔╝     ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║     ║".bright_cyan());
    println!("{}", "║   ██║  ██║ ██╔██╗     ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║     ║".bright_cyan());
    println!("{}", "║   ██████╔╝██╔╝ ██╗    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║     ║".bright_cyan());
    println!("{}", "║   ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝     ║".bright_cyan());
    println!("{}", "║                                                               ║".bright_cyan());
    println!("{}", "║   🤖 AGI-like AI Agent | Connect to ANY app | 70% token savings  ║".bright_cyan());
    println!("{}", "║                                                               ║".bright_cyan());
    println!("{}", "╚═══════════════════════════════════════════════════════════════╝".bright_cyan());
    println!();
}
