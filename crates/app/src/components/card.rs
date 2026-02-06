use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

pub struct Card {
    icon: String,
    text: String,
}

impl Card {
    pub fn new(icon: impl Into<String>, text: impl Into<String>) -> Self {
        Self {
            icon: icon.into(),
            text: text.into(),
        }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_3()
            .px_4()
            .py_5()
            .w(px(200.0))
            .rounded(px(8.0))
            .bg(theme.card)
            .border_1()
            .border_color(theme.border)
            .hover(move |style| style.bg(theme.accent))
            .cursor_pointer()
            .child(
                div()
                    .text_2xl()
                    .child(self.icon),
            )
            .child(
                div()
                    .text_sm()
                    .text_color(theme.card_foreground)
                    .child(self.text),
            )
    }
}
