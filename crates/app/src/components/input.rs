#![allow(dead_code)]

use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

pub struct InputArea {
    theme: Theme,
}

impl InputArea {
    pub fn new(theme: Theme) -> Self {
        Self { theme }
    }

    pub fn render(self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .px_6()
            .py_4()
            .child(self.render_input_field())
            .child(self.render_bottom_bar())
    }

    fn render_input_field(&self) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .gap_2()
            .px_4()
            .py_3()
            .rounded(px(8.0))
            .bg(self.theme.card)
            .border_1()
            .border_color(self.theme.border)
            .child(
                div()
                    .flex_1()
                    .text_sm()
                    .text_color(self.theme.muted_foreground)
                    .child("Ask Codex anything, @ to add files, / for commands"),
            )
            .child(
                div()
                    .size(px(32.0))
                    .rounded(px(16.0))
                    .bg(self.theme.muted_foreground)
                    .flex()
                    .items_center()
                    .justify_center()
                    .cursor_pointer()
                    .child(
                        div()
                            .text_color(self.theme.background)
                            .child("▶"),
                    ),
            )
    }

    fn render_bottom_bar(&self) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .justify_between()
            .mt_2()
            .px_2()
            .child(
                div()
                    .flex()
                    .gap_2()
                    .text_xs()
                    .text_color(self.theme.muted_foreground)
                    .child("GPT-5.2-Codex")
                    .child("High"),
            )
            .child(
                div()
                    .flex()
                    .gap_2()
                    .text_xs()
                    .text_color(self.theme.muted_foreground)
                    .child("Local")
                    .child("Worktree")
                    .child("Cloud"),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(self.theme.muted_foreground)
                    .child("🔧 (neo)actual-redesign"),
            )
    }
}
