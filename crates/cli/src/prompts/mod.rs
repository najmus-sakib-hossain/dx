//! Beautiful CLI prompts inspired by cliclack
//!
//! Provides interactive prompts with a Vercel-like aesthetic:
//! - [`Input`] - Text input with validation
//! - [`Confirm`] - Yes/no confirmation
//! - [`Select`] - Single selection from a list
//! - [`MultiSelect`] - Multiple selections from a list
//! - [`Password`] - Masked password input
//! - [`Spinner`] - Animated spinner for async operations
//! - [`ProgressBar`] - Progress bar for tracking completion

#[allow(unused)]
pub mod cursor;
#[allow(unused)]
pub mod interaction;

#[allow(unused)]
pub mod confirm;
#[allow(unused)]
pub mod input;
#[allow(unused)]
pub mod multiselect;
#[allow(unused)]
pub mod password;
#[allow(unused)]
pub mod progress;
#[allow(unused)]
pub mod select;
#[allow(unused)]
pub mod spinner;

use console::Term;
use once_cell::sync::Lazy;
use std::fmt::Display;
use std::io;
use std::sync::RwLock;

#[allow(unused)]
pub use confirm::Confirm;
#[allow(unused)]
pub use input::Input;
#[allow(unused)]
pub use interaction::{PromptInteraction, State, Validate};
#[allow(unused)]
pub use multiselect::{MultiSelect, MultiSelectItem};
#[allow(unused)]
pub use password::Password;
#[allow(unused)]
pub use progress::ProgressBar;
#[allow(unused)]
pub use select::{Select, SelectItem};
#[allow(unused)]
pub use spinner::Spinner;

// ─────────────────────────────────────────────────────────────────────────────
// Theme Configuration
// ─────────────────────────────────────────────────────────────────────────────

/// DX CLI Theme - Vercel-like aesthetic
#[allow(unused)]
pub struct DxTheme {
    pub primary: console::Style,
    pub success: console::Style,
    #[allow(unused)]
    pub warning: console::Style,
    pub error: console::Style,
    pub dim: console::Style,
}

impl Default for DxTheme {
    fn default() -> Self {
        Self {
            primary: console::Style::new().cyan(),
            success: console::Style::new().green(),
            warning: console::Style::new().yellow(),
            error: console::Style::new().red(),
            dim: console::Style::new().dim(),
        }
    }
}

pub static THEME: Lazy<RwLock<DxTheme>> = Lazy::new(|| RwLock::new(DxTheme::default()));

// ─────────────────────────────────────────────────────────────────────────────
// Symbols
// ─────────────────────────────────────────────────────────────────────────────

/// Symbol set for rendering prompts
pub struct Symbols {
    pub step_active: &'static str,
    #[allow(unused)]
    pub step_cancel: &'static str,
    #[allow(unused)]
    pub step_error: &'static str,
    pub step_submit: &'static str,
    pub bar_start: &'static str,
    pub bar: &'static str,
    pub bar_end: &'static str,
    pub radio_active: &'static str,
    pub radio_inactive: &'static str,
    pub checkbox_active: &'static str,
    pub checkbox_selected: &'static str,
    pub checkbox_inactive: &'static str,
    pub password_mask: char,
    #[allow(unused)]
    pub bar_h: &'static str,
    #[allow(unused)]
    pub corner_top_right: &'static str,
    #[allow(unused)]
    pub connect_left: &'static str,
    #[allow(unused)]
    pub corner_bottom_right: &'static str,
    // New box-drawing symbols for OpenClaw-style UI
    #[allow(unused)]
    pub box_top_left: &'static str,
    #[allow(unused)]
    pub box_top_right: &'static str,
    #[allow(unused)]
    pub box_bottom_left: &'static str,
    #[allow(unused)]
    pub box_bottom_right: &'static str,
    #[allow(unused)]
    pub box_horizontal: &'static str,
    #[allow(unused)]
    pub box_vertical: &'static str,
    #[allow(unused)]
    pub box_left_t: &'static str,
    #[allow(unused)]
    pub box_right_t: &'static str,
}

impl Symbols {
    /// Unicode symbols for modern terminals
    const fn unicode() -> Self {
        Self {
            step_active: "◆",
            step_cancel: "■",
            step_error: "▲",
            step_submit: "◇",
            bar_start: "┌",
            bar: "│",
            bar_end: "└",
            radio_active: "●",
            radio_inactive: "○",
            checkbox_active: "◻",
            checkbox_selected: "◼",
            checkbox_inactive: "◻",
            password_mask: '•',
            bar_h: "─",
            corner_top_right: "╮",
            connect_left: "├",
            corner_bottom_right: "╯",
            // Box-drawing for OpenClaw-style UI
            box_top_left: "┌",
            box_top_right: "╮",
            box_bottom_left: "├",
            box_bottom_right: "╯",
            box_horizontal: "─",
            box_vertical: "│",
            box_left_t: "├",
            box_right_t: "╯",
        }
    }

    /// ASCII-safe symbols for Git Bash and limited terminals
    const fn ascii() -> Self {
        Self {
            step_active: ">",
            step_cancel: "x",
            step_error: "!",
            step_submit: "*",
            bar_start: "+",
            bar: "|",
            bar_end: "+",
            radio_active: "(*)",
            radio_inactive: "( )",
            checkbox_active: "[ ]",
            checkbox_selected: "[x]",
            checkbox_inactive: "[ ]",
            password_mask: '*',
            bar_h: "-",
            corner_top_right: "+",
            connect_left: "+",
            corner_bottom_right: "+",
            // Box-drawing for OpenClaw-style UI (ASCII fallback)
            box_top_left: "+",
            box_top_right: "+",
            box_bottom_left: "+",
            box_bottom_right: "+",
            box_horizontal: "-",
            box_vertical: "|",
            box_left_t: "+",
            box_right_t: "+",
        }
    }
}

/// Detects if the terminal supports Unicode
fn supports_unicode() -> bool {
    // Always use Unicode - modern terminals including Git Bash support it
    true
}

pub static SYMBOLS: Lazy<Symbols> = Lazy::new(|| {
    if supports_unicode() {
        Symbols::unicode()
    } else {
        Symbols::ascii()
    }
});

// Legacy constants for backward compatibility
#[allow(unused)]
pub const S_STEP_ACTIVE: &str = "◆";
#[allow(unused)]
pub const S_STEP_CANCEL: &str = "■";
#[allow(unused)]
pub const S_STEP_ERROR: &str = "▲";
#[allow(unused)]
pub const S_STEP_SUBMIT: &str = "◇";

#[allow(unused)]
pub const S_BAR_START: &str = "┌";
#[allow(unused)]
pub const S_BAR: &str = "│";
#[allow(unused)]
pub const S_BAR_END: &str = "└";

#[allow(unused)]
pub const S_RADIO_ACTIVE: &str = "●";
#[allow(unused)]
pub const S_RADIO_INACTIVE: &str = "○";
#[allow(unused)]
pub const S_CHECKBOX_ACTIVE: &str = "◻";
#[allow(unused)]
pub const S_CHECKBOX_SELECTED: &str = "◼";
#[allow(unused)]
pub const S_CHECKBOX_INACTIVE: &str = "◻";

#[allow(unused)]
pub const S_PASSWORD_MASK: char = '•';

#[allow(unused)]
pub const S_BAR_H: &str = "─";
#[allow(unused)]
pub const S_CORNER_TOP_RIGHT: &str = "╮";
#[allow(unused)]
pub const S_CONNECT_LEFT: &str = "├";
#[allow(unused)]
pub const S_CORNER_BOTTOM_RIGHT: &str = "╯";

// ─────────────────────────────────────────────────────────────────────────────
// Public API Functions
// ─────────────────────────────────────────────────────────────────────────────

fn term_write(line: impl Display) -> io::Result<()> {
    Term::stderr().write_str(line.to_string().as_str())
}

/// Prints a header for the prompt sequence.
pub fn intro(title: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    // No newline after intro - next prompt will continue immediately
    term_write(format!(
        "{}  {}",
        theme.dim.apply_to(symbols.bar_start),
        title,
    ))
}

/// Prints a section header with horizontal line
pub fn section(title: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    let title_str = title.to_string();
    let width: usize = 90; // Terminal width
    let title_with_spaces = format!("  {}  ", title_str);
    let remaining = width.saturating_sub(title_with_spaces.len() + 2);
    
    term_write(format!(
        "{}{} {}{}{}",
        theme.dim.apply_to(symbols.bar),
        theme.primary.apply_to(symbols.step_submit),
        title_with_spaces,
        theme.dim.apply_to(symbols.box_horizontal.repeat(remaining)),
        theme.dim.apply_to(symbols.box_top_right)
    ))?;
    term_write("\n")
}

/// Prints a boxed content section
pub fn box_section(title: &str, lines: &[&str]) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    let width: usize = 90;
    
    // Top border with title
    section(title)?;
    
    // Empty line
    term_write(format!("{}{}",
        theme.dim.apply_to(symbols.bar),
        " ".repeat(width)
    ))?;
    term_write("\n")?;
    
    // Content lines
    for line in lines {
        let padded = format!("  {}", line);
        let padding = width.saturating_sub(padded.len() + 1);
        term_write(format!("{}{}{}{}",
            theme.dim.apply_to(symbols.bar),
            padded,
            " ".repeat(padding),
            theme.dim.apply_to(symbols.bar)
        ))?;
        term_write("\n")?;
    }
    
    // Empty line
    term_write(format!("{}{}",
        theme.dim.apply_to(symbols.bar),
        " ".repeat(width)
    ))?;
    term_write("\n")?;
    
    // Bottom border
    term_write(format!("{}{}{}",
        theme.dim.apply_to(symbols.box_bottom_left),
        theme.dim.apply_to(symbols.box_horizontal.repeat(width - 1)),
        theme.dim.apply_to(symbols.box_bottom_right)
    ))?;
    term_write("\n")
}

/// Prints a footer for the prompt sequence.
pub fn outro(message: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    term_write(format!("{}{} {}\n", theme.dim.apply_to(symbols.bar), theme.success.apply_to(symbols.step_submit), message,))
}
#[allow(unused)]
pub fn outro_cancel(message: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    term_write(format!(
        "{}  {}\n",
        theme.error.apply_to(symbols.bar_end),
        theme.error.apply_to(message.to_string()),
    ))
}

/// Creates a new text input prompt.
#[allow(unused)]
pub fn input(prompt: impl Into<String>) -> input::Input<fn(&str) -> interaction::Validate<String>> {
    input::input(prompt.into())
}

/// Creates a new password prompt.
#[allow(unused)]
pub fn password(
    prompt: impl Into<String>,
) -> password::Password<fn(&str) -> interaction::Validate<String>> {
    password::password(prompt.into())
}

/// Creates a new confirmation prompt.
pub fn confirm(prompt: impl Into<String>) -> Confirm {
    Confirm::new(prompt.into())
}

/// Creates a new single-select prompt.
pub fn select<T: Clone>(prompt: impl Into<String>) -> Select<T> {
    Select::new(prompt.into())
}

/// Creates a new multi-select prompt.
pub fn multiselect<T: Clone>(prompt: impl Into<String>) -> MultiSelect<T> {
    MultiSelect::new(prompt.into())
}

/// Creates a new spinner for async operations.
#[allow(unused)]
pub fn spinner(message: impl Into<String>) -> Spinner {
    Spinner::new(message)
}

/// Creates a new progress bar.
#[allow(unused)]
pub fn progress(message: impl Into<String>, total: u64) -> ProgressBar {
    ProgressBar::new(message, total)
}

// ─────────────────────────────────────────────────────────────────────────────
// Box Drawing Helpers (OpenClaw-style UI)
// ─────────────────────────────────────────────────────────────────────────────

/// Draws a boxed section with title and content
#[allow(unused)]
pub fn draw_box(title: &str, content: &[&str], width: usize) -> Vec<String> {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    let mut lines = Vec::new();
    
    // Top border with title
    let title_line = if title.is_empty() {
        format!("{}{}{}", 
            symbols.box_top_left,
            symbols.box_horizontal.repeat(width - 2),
            symbols.box_top_right
        )
    } else {
        let title_with_spaces = format!("  {}  ", title);
        let remaining = width.saturating_sub(title_with_spaces.len() + 1);
        format!("{}{}{}{}",
            symbols.box_top_left,
            theme.dim.apply_to(symbols.box_horizontal.repeat(1)),
            title_with_spaces,
            theme.dim.apply_to(symbols.box_horizontal.repeat(remaining))
        ) + symbols.box_top_right
    };
    lines.push(theme.dim.apply_to(title_line).to_string());
    
    // Empty line after title
    lines.push(format!("{}{}{}",
        theme.dim.apply_to(symbols.box_vertical),
        " ".repeat(width - 2),
        theme.dim.apply_to(symbols.box_vertical)
    ));
    
    // Content lines
    for line in content {
        let padded = format!("  {}", line);
        let padding = width.saturating_sub(padded.len() + 2);
        lines.push(format!("{}{}{}{}",
            theme.dim.apply_to(symbols.box_vertical),
            padded,
            " ".repeat(padding),
            theme.dim.apply_to(symbols.box_vertical)
        ));
    }
    
    // Empty line before bottom
    lines.push(format!("{}{}{}",
        theme.dim.apply_to(symbols.box_vertical),
        " ".repeat(width - 2),
        theme.dim.apply_to(symbols.box_vertical)
    ));
    
    // Bottom border
    lines.push(format!("{}{}{}",
        theme.dim.apply_to(symbols.box_bottom_left),
        theme.dim.apply_to(symbols.box_horizontal.repeat(width - 2)),
        theme.dim.apply_to(symbols.box_bottom_right)
    ));
    
    lines
}

/// Draws a horizontal separator line
#[allow(unused)]
pub fn draw_separator(width: usize) -> String {
    let theme = THEME.read().unwrap();
    let symbols = &*SYMBOLS;
    format!("{}{}",
        theme.dim.apply_to(symbols.box_vertical),
        theme.dim.apply_to(symbols.box_horizontal.repeat(width - 1))
    )
}

/// Log messages with different styles
pub mod log {
    use super::*;
    use owo_colors::OwoColorize;

    /// Prints an info message.
    pub fn info(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "●".blue(), text);
        Ok(())
    }

    /// Prints a success message.
    pub fn success(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "✓".green().bold(), text);
        Ok(())
    }

    /// Prints a warning message.
    pub fn warning(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "⚠".yellow().bold(), text);
        Ok(())
    }

    /// Prints an error message.
    #[allow(unused)]
    pub fn error(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "✕".red().bold(), text);
        Ok(())
    }

    /// Prints a step message.
    pub fn step(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "◇".green(), text);
        Ok(())
    }

    /// Prints a remark message.
    #[allow(unused)]
    pub fn remark(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "├".bright_black(), text);
        Ok(())
    }
}
