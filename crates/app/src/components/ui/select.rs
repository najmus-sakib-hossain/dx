use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

/// A reusable select/dropdown component following shadcn-ui patterns
/// Note: Full dropdown functionality requires View state management in GPUI
/// For now, this provides visual feedback only
/// 
/// # Example
/// ```rust
/// Select::new("pack-selector")
///     .placeholder("Select a pack...")
///     .options(vec!["All", "Material Icons", "Heroicons"])
///     .value(Some("All"))
///     .render(&theme)
/// ```
pub struct Select {
    #[allow(dead_code)]
    id: String,
    placeholder: String,
    #[allow(dead_code)]
    options: Vec<String>,
    selected_value: Option<String>,
    disabled: bool,
}

impl Select {
    /// Create a new select component with a unique ID
    pub fn new(id: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            placeholder: "Select an option...".to_string(),
            options: Vec::new(),
            selected_value: None,
            disabled: false,
        }
    }

    /// Set the placeholder text
    pub fn placeholder(mut self, text: impl Into<String>) -> Self {
        self.placeholder = text.into();
        self
    }

    /// Set the available options
    pub fn options(mut self, options: Vec<String>) -> Self {
        self.options = options;
        self
    }

    /// Set the currently selected value
    pub fn value(mut self, value: Option<String>) -> Self {
        self.selected_value = value;
        self
    }

    /// Disable the select
    #[allow(dead_code)]
    pub fn disabled(mut self, disabled: bool) -> Self {
        self.disabled = disabled;
        self
    }

    /// Render the select component
    pub fn render(self, theme: &Theme) -> impl IntoElement {
        let display_text = self.selected_value
            .as_ref()
            .map(|v| v.as_str())
            .unwrap_or(&self.placeholder);

        let text_color = if self.selected_value.is_some() {
            theme.foreground
        } else {
            theme.muted_foreground
        };

        let bg_color = if self.disabled {
            theme.muted
        } else {
            theme.card
        };

        div()
            .flex()
            .items_center()
            .justify_between()
            .gap_2()
            .px_3()
            .py_2()
            .min_w(px(180.0))
            .rounded(px(6.0))
            .bg(bg_color)
            .border_1()
            .border_color(theme.border)
            .when(!self.disabled, |this| {
                this.cursor_pointer()
                    .hover(move |style| {
                        style
                            .bg(theme.accent)
                            .border_color(theme.ring)
                    })
            })
            .child(
                div()
                    .flex_1()
                    .text_sm()
                    .text_color(text_color)
                    .child(display_text.to_string()),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(theme.muted_foreground)
                    .child("▼"),
            )
    }
}

/// Select option item (for future dropdown implementation)
#[allow(dead_code)]
pub struct SelectOption {
    value: String,
    label: String,
    disabled: bool,
}

#[allow(dead_code)]
impl SelectOption {
    pub fn new(value: impl Into<String>, label: impl Into<String>) -> Self {
        Self {
            value: value.into(),
            label: label.into(),
            disabled: false,
        }
    }

    pub fn disabled(mut self, disabled: bool) -> Self {
        self.disabled = disabled;
        self
    }

    pub fn render(self, theme: &Theme, selected: bool) -> impl IntoElement {
        let bg = if selected {
            theme.accent
        } else {
            theme.card
        };

        let text_color = if self.disabled {
            theme.muted_foreground
        } else {
            theme.foreground
        };

        div()
            .flex()
            .items_center()
            .px_3()
            .py_2()
            .bg(bg)
            .when(!self.disabled, |this| {
                this.cursor_pointer()
                    .hover(move |style| style.bg(theme.accent))
            })
            .child(
                div()
                    .text_sm()
                    .text_color(text_color)
                    .child(self.label),
            )
    }
}
