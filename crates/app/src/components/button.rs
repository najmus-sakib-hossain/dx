use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

pub struct Button {
    label: String,
    variant: ButtonVariant,
}

#[derive(Clone, Copy)]
#[allow(dead_code)]
pub enum ButtonVariant {
    Primary,
    Secondary,
    Ghost,
}

impl Button {
    pub fn new(label: impl Into<String>) -> Self {
        Self {
            label: label.into(),
            variant: ButtonVariant::Secondary,
        }
    }

    #[allow(dead_code)]
    pub fn primary(mut self) -> Self {
        self.variant = ButtonVariant::Primary;
        self
    }

    pub fn secondary(mut self) -> Self {
        self.variant = ButtonVariant::Secondary;
        self
    }

    #[allow(dead_code)]
    pub fn ghost(mut self) -> Self {
        self.variant = ButtonVariant::Ghost;
        self
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        let (bg, fg, hover_bg) = match self.variant {
            ButtonVariant::Primary => (theme.primary, theme.primary_foreground, theme.secondary),
            ButtonVariant::Secondary => (theme.secondary, theme.secondary_foreground, theme.accent),
            ButtonVariant::Ghost => (theme.background, theme.foreground, theme.accent),
        };

        div()
            .px_3()
            .py_1()
            .rounded(px(6.0))
            .bg(bg)
            .hover(move |style| style.bg(hover_bg))
            .cursor_pointer()
            .child(
                div()
                    .text_sm()
                    .text_color(fg)
                    .child(self.label),
            )
    }
}
