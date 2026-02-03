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

pub mod cursor;
pub mod interaction;

pub mod confirm;
pub mod input;
pub mod multiselect;
pub mod password;
pub mod progress;
pub mod select;
pub mod spinner;

use console::Term;
use once_cell::sync::Lazy;
use std::fmt::Display;
use std::io;
use std::sync::RwLock;

pub use confirm::Confirm;
pub use input::Input;
pub use interaction::{PromptInteraction, State, Validate};
pub use multiselect::{MultiSelect, MultiSelectItem};
pub use password::Password;
pub use progress::ProgressBar;
pub use select::{Select, SelectItem};
pub use spinner::Spinner;

// ─────────────────────────────────────────────────────────────────────────────
// Theme Configuration
// ─────────────────────────────────────────────────────────────────────────────

/// DX CLI Theme - Vercel-like aesthetic
pub struct DxTheme {
    pub primary: console::Style,
    pub success: console::Style,
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

pub const S_STEP_ACTIVE: &str = "◆";
pub const S_STEP_CANCEL: &str = "■";
pub const S_STEP_ERROR: &str = "▲";
pub const S_STEP_SUBMIT: &str = "◇";

pub const S_BAR_START: &str = "┌";
pub const S_BAR: &str = "│";
pub const S_BAR_END: &str = "└";

pub const S_RADIO_ACTIVE: &str = "●";
pub const S_RADIO_INACTIVE: &str = "○";
pub const S_CHECKBOX_ACTIVE: &str = "◻";
pub const S_CHECKBOX_SELECTED: &str = "◼";
pub const S_CHECKBOX_INACTIVE: &str = "◻";

pub const S_PASSWORD_MASK: char = '•';

pub const S_BAR_H: &str = "─";
pub const S_CORNER_TOP_RIGHT: &str = "╮";
pub const S_CONNECT_LEFT: &str = "├";
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
    term_write(format!(
        "{}  {}\n{}\n",
        theme.dim.apply_to(S_BAR_START),
        title,
        theme.dim.apply_to(S_BAR),
    ))
}

/// Prints a footer for the prompt sequence.
pub fn outro(message: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    term_write(format!("{}  {}\n", theme.dim.apply_to(S_BAR_END), message,))
}

/// Prints a cancelled footer for the prompt sequence.
pub fn outro_cancel(message: impl Display) -> io::Result<()> {
    let theme = THEME.read().unwrap();
    term_write(format!(
        "{}  {}\n",
        theme.error.apply_to(S_BAR_END),
        theme.error.apply_to(message.to_string()),
    ))
}

/// Creates a new text input prompt.
pub fn input(prompt: impl Into<String>) -> input::Input<fn(&str) -> interaction::Validate<String>> {
    input::input(prompt.into())
}

/// Creates a new password prompt.
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
pub fn spinner(message: impl Into<String>) -> Spinner {
    Spinner::new(message)
}

/// Creates a new progress bar.
pub fn progress(message: impl Into<String>, total: u64) -> ProgressBar {
    ProgressBar::new(message, total)
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
    pub fn remark(text: impl Display) -> io::Result<()> {
        eprintln!("  {} {}", "├".bright_black(), text);
        Ok(())
    }
}
