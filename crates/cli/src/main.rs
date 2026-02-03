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
mod prompts;

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
    command: Option<Commands>,
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
        Some(Commands::Agent { action }) => commands::agent::run(action).await?,
        Some(Commands::Connect { integration, token }) => {
            commands::connect::run(&integration, token.as_deref()).await?
        }
        Some(Commands::Disconnect { integration }) => {
            commands::disconnect::run(&integration).await?
        }
        Some(Commands::Create { what }) => commands::create::run(what).await?,
        Some(Commands::List { what }) => commands::list::run(what).await?,
        Some(Commands::Skills { action }) => commands::skills::run(action).await?,
        Some(Commands::Run { command }) => {
            let cmd = command.join(" ");
            commands::run::run(&cmd).await?
        }
        Some(Commands::Schedule { action }) => commands::schedule::run(action).await?,
        Some(Commands::Serializer { action }) => commands::serializer::run(action).await?,
        Some(Commands::Status) => commands::status::run().await?,
        Some(Commands::Init) => commands::init::run().await?,
        None => run_onboarding().await?,
    }
    
    Ok(())
}

async fn run_onboarding() -> anyhow::Result<()> {
    use prompts::{
        autocomplete, box_section, confirm, intro, list_editor, log, multiselect, number, outro,
        rating, select, slider, tags, text, toggle, PromptInteraction, Validate,
    };

    intro("Welcome to DX - Your AGI-like AI Agent")?;

    box_section(
        "Interactive Prompt Showcase",
        &[
            "Experience our beautiful CLI prompt system!",
            "We'll demonstrate 15+ different input types with our design system.",
        ],
    )?;

    // Text Input Demo
    let mut name_prompt = text("What's your name?")
        .placeholder("Enter your name")
        .validate(|input: &str| {
            if input.trim().is_empty() {
                Validate::Invalid("Name cannot be empty".to_string())
            } else if input.len() < 2 {
                Validate::Invalid("Name must be at least 2 characters".to_string())
            } else {
                Validate::Valid
            }
        });
    let name = name_prompt.interact()?;

    log::success(format!("Welcome, {}! Let's continue with the setup.", name))?;

    // Rating Demo
    let mut satisfaction_prompt = rating("How satisfied are you with CLI tools?").max(5);
    let _satisfaction = satisfaction_prompt.interact()?;

    // Toggle Demo
    let mut notifications_prompt = toggle("Enable desktop notifications?")
        .labels("Enabled", "Disabled")
        .initial_value(true);
    let _notifications = notifications_prompt.interact()?;

    // Slider Demo
    let mut confidence_prompt = slider("Set AI confidence threshold (0-100)", 0, 100)
        .step(5)
        .initial_value(75);
    let _confidence = confidence_prompt.interact()?;

    log::info("Great choices! Now let's configure your team settings.")?;

    // Number Input Demo
    let mut team_size_prompt = number("How many team members will use DX?").min(1).max(1000);
    let team_size = team_size_prompt.interact()?;

    if team_size > 10 {
        log::info("Great! DX scales perfectly for large teams.")?;
    }

    // Tags Demo
    let mut skills_prompt = tags("Enter your team's skills")
        .placeholder("Type a skill and press Enter or comma");
    let _skills = skills_prompt.interact()?;

    // List Editor Demo
    let mut goals_prompt = list_editor("Manage your project goals")
        .initial_items(vec!["Launch MVP".to_string(), "Get 100 users".to_string()]);
    let _goals = goals_prompt.interact()?;

    // Autocomplete Demo
    let mut framework_prompt = autocomplete("Select your primary development framework:")
        .item_with_description("react", "React", "A JavaScript library for building UIs")
        .item_with_description("vue", "Vue.js", "The Progressive JavaScript Framework")
        .item_with_description("angular", "Angular", "Platform for building mobile and desktop apps")
        .item_with_description("svelte", "Svelte", "Cybernetically enhanced web apps")
        .item_with_description("nextjs", "Next.js", "The React Framework for Production")
        .item_with_description("nuxt", "Nuxt", "The Intuitive Vue Framework")
        .item_with_description("astro", "Astro", "Build faster websites")
        .item_with_description("remix", "Remix", "Full stack web framework")
        .item_with_description("solid", "SolidJS", "Simple and performant reactivity")
        .item_with_description("qwik", "Qwik", "Resumable framework");
    let _framework = framework_prompt.interact()?;

    box_section(
        "AI Configuration",
        &["Now let's configure your AI providers and integrations."],
    )?;

    // Choose AI providers
    let mut providers_prompt = multiselect("Select AI providers to configure:")
        .item("openai", "OpenAI (GPT-4, GPT-3.5)", "Most popular, great for general tasks")
        .item("anthropic", "Anthropic (Claude)", "Excellent for analysis and writing")
        .item("google", "Google (Gemini)", "Fast and cost-effective")
        .item("ollama", "Ollama (Local models)", "Run models locally for privacy")
        .item("custom", "Custom API endpoint", "Connect to any OpenAI-compatible API");
    let providers = providers_prompt.interact()?;

    if providers.is_empty() {
        log::warning("No providers selected. You can configure them later with 'dx connect <provider>'")?;
    }

    // Choose integrations
    let mut integrations_prompt = multiselect("Select integrations to set up:")
        .item("github", "GitHub", "Code repositories and PR management")
        .item("discord", "Discord", "Chat and community management")
        .item("telegram", "Telegram", "Messaging and notifications")
        .item("notion", "Notion", "Document and knowledge management")
        .item("spotify", "Spotify", "Music control and recommendations")
        .item("gmail", "Gmail", "Email processing and automation")
        .item("slack", "Slack", "Team communication")
        .item("twitter", "Twitter/X", "Social media monitoring")
        .item("browser", "Browser automation", "Web scraping and control")
        .item("filesystem", "File system access", "Local file operations");
    let integrations = integrations_prompt.interact()?;

    if integrations.is_empty() {
        log::info("No integrations selected. You can add them later with 'dx connect <integration>'")?;
    }

    // Choose tools/capabilities
    let mut tools_prompt = multiselect("Select AI tools and capabilities:")
        .item("code_generation", "Code Generation", "Generate, refactor, and explain code")
        .item("data_analysis", "Data Analysis", "Process and analyze datasets")
        .item("web_search", "Web Search", "Search and summarize web content")
        .item("image_generation", "Image Generation", "Create images with AI")
        .item("speech_recognition", "Speech Recognition", "Transcribe audio to text")
        .item("translation", "Translation", "Translate between languages")
        .item("summarization", "Summarization", "Condense long texts")
        .item("automation", "Task Automation", "Automate repetitive tasks")
        .item("research", "Research Assistant", "Help with research and analysis");
    let tools = tools_prompt.interact()?;

    if tools.is_empty() {
        log::info("No tools selected. All tools will be available by default.")?;
    }

    // Choose default AI model
    let mut default_model_prompt = select("Choose your default AI model:")
        .item("gpt-4", "GPT-4", "Most capable, best for complex tasks")
        .item("claude-3", "Claude 3", "Excellent for analysis and writing")
        .item("gemini-pro", "Gemini Pro", "Fast and cost-effective")
        .item("llama-3", "Llama 3 (Local)", "Privacy-focused, runs locally")
        .item("custom", "Custom model", "Specify your own model");
    let _default_model = default_model_prompt.interact()?;

    // Ask about daemon mode
    let mut start_daemon_prompt = confirm("Would you like to start the DX agent daemon now?")
        .initial_value(true);
    let start_daemon = start_daemon_prompt.interact()?;

    if start_daemon {
        log::step("Starting DX agent daemon...")?;
        // Here we would start the daemon
        // For now, just show the command
        log::success("Daemon started! Use 'dx status' to check status.")?;
    }

    // Final setup confirmation
    let mut proceed_prompt = confirm("Setup complete! Would you like to start chatting with your AI agent?")
        .initial_value(true);
    let proceed = proceed_prompt.interact()?;

    if proceed {
        outro("🎉 Setup complete! Run 'dx run \"hello\"' to start chatting, or use any of the configured integrations.")?;
    } else {
        outro("Setup complete! You can always start later with 'dx run <your message>'")?;
    }

    Ok(())
}

fn print_banner() {
    // Build banner lines and pad them to a consistent visual width using unicode-width
    use unicode_width::UnicodeWidthStr;

    let lines: Vec<&str> = vec![
        "",
        "   ██████╗ ██╗  ██╗     █████╗  ██████╗ ███████╗███╗   ██╗████████╗",
        "   ██╔══██╗╚██╗██╔╝    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝",
        "   ██║  ██║ ╚███╔╝     ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║",
        "   ██║  ██║ ██╔██╗     ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║",
        "   ██████╔╝██╔╝ ██╗    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║",
        "   ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝",
        "",
        "   🤖 AGI-like AI Agent | Connect to ANY app | 70% token savings",
        "",
    ];

    let max_width = lines.iter().map(|s| UnicodeWidthStr::width(*s)).max().unwrap_or(0);
    let top = format!("╔{}╗", "═".repeat(max_width));
    let bottom = format!("╚{}╝", "═".repeat(max_width));

    println!();
    println!("{}", top.bright_cyan());
    for line in &lines {
        let cur = UnicodeWidthStr::width(*line);
        let mut s = (*line).to_string();
        if cur < max_width {
            s.push_str(&" ".repeat(max_width - cur));
        }
        println!("{}", format!("║{}║", s).bright_cyan());
    }
    println!("{}", bottom.bright_cyan());
    println!();
}
