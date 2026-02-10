use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

/// Search bar component for the icon picker
pub struct SearchBar {
    query: String,
    selected_pack: Option<String>,
    pack_names: Vec<String>,
}

impl SearchBar {
    pub fn new(
        query: String,
        selected_pack: Option<String>,
        pack_names: Vec<String>,
    ) -> Self {
        Self {
            query,
            selected_pack,
            pack_names,
        }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .gap_3()
            .px_6()
            .py_3()
            .border_b_1()
            .border_color(theme.border)
            // Search input area
            .child(self.render_search_input(theme))
            // Pack selector dropdown
            .child(self.render_pack_selector(theme))
    }

    fn render_search_input(&self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .flex_1()
            .items_center()
            .gap_2()
            .px_4()
            .py_2()
            .rounded(px(8.0))
            .bg(theme.card)
            .border_1()
            .border_color(theme.border)
            .child(
                div()
                    .text_sm()
                    .text_color(theme.muted_foreground)
                    .child("🔍"),
            )
            .child(
                div()
                    .flex_1()
                    .text_sm()
                    .text_color(if self.query.is_empty() {
                        theme.muted_foreground
                    } else {
                        theme.foreground
                    })
                    .child(if self.query.is_empty() {
                        "Search icons... (e.g. home, arrow, github)".to_string()
                    } else {
                        self.query.clone()
                    }),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(theme.muted_foreground)
                    .px_2()
                    .py_1()
                    .rounded(px(4.0))
                    .bg(theme.muted)
                    .child("⌘K"),
            )
    }

    fn render_pack_selector(&self, theme: &Theme) -> impl IntoElement {
        let label = self
            .selected_pack
            .as_ref()
            .map(|p| p.as_str())
            .unwrap_or("All Packs");

        div()
            .flex()
            .items_center()
            .gap_2()
            .px_3()
            .py_2()
            .rounded(px(8.0))
            .bg(theme.secondary)
            .border_1()
            .border_color(theme.border)
            .cursor_pointer()
            .hover(move |style| style.bg(theme.accent))
            .child(
                div()
                    .text_sm()
                    .text_color(theme.foreground)
                    .child(label.to_string()),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(theme.muted_foreground)
                    .child("▼"),
            )
    }
}
