#![allow(dead_code)]

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
        let theme_clone = theme.clone();
        
        div()
            .flex()
            .flex_col()
            .gap_3()
            .border_b_1()
            .border_color(theme.border)
            // Search input area
            .child(self.render_search_input(theme))
            // Pack filter chips
            .child(self.render_pack_filters(&theme_clone))
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
                        "Search icons... (type to search)".to_string()
                    } else {
                        format!("Searching: {}", self.query)
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

    fn render_pack_filters(self, theme: &Theme) -> impl IntoElement {
        let mut chips = div()
            .flex()
            .flex_wrap()
            .gap_2()
            .px_6()
            .py_3();

        // "All" chip
        let all_active = self.selected_pack.is_none();
        
        chips = chips.child(
            self.render_pack_chip("All", all_active, theme)
        );

        // Show top 15 packs
        for pack_name in self.pack_names.iter().take(15) {
            let active = self
                .selected_pack
                .as_ref()
                .map(|p| p == pack_name)
                .unwrap_or(false);
            
            chips = chips.child(
                self.render_pack_chip(pack_name, active, theme)
            );
        }

        chips
    }

    fn render_pack_chip(
        &self,
        label: &str,
        active: bool,
        theme: &Theme,
    ) -> impl IntoElement {
        let bg = if active {
            theme.primary
        } else {
            theme.secondary
        };
        let fg = if active {
            theme.primary_foreground
        } else {
            theme.secondary_foreground
        };

        div()
            .flex()
            .items_center()
            .gap_1()
            .px_3()
            .py_1()
            .rounded(px(12.0))
            .bg(bg)
            .cursor_pointer()
            .hover(move |style| style.bg(theme.accent))
            .child(
                div()
                    .text_xs()
                    .text_color(fg)
                    .child(label.to_string()),
            )
    }
}
