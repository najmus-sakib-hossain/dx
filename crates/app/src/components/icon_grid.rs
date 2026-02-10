use gpui::{div, svg, prelude::*, px, IntoElement, SharedString};
use crate::theme::Theme;

/// A single icon to render in the grid
#[derive(Clone)]
#[allow(dead_code)]
pub struct IconGridItem {
    pub index: usize,
    pub name: String,
    pub pack: String,
    pub svg_body: String,
    pub width: f32,
    pub height: f32,
    pub selected: bool,
}

/// Icon grid component - renders a responsive grid of icon cards
pub struct IconGrid {
    items: Vec<IconGridItem>,
}

impl IconGrid {
    pub fn new(items: Vec<IconGridItem>) -> Self {
        Self { items }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        let mut grid = div()
            .flex()
            .flex_wrap()
            .gap_2()
            .p_4();

        if self.items.is_empty() {
            return grid
                .flex_col()
                .items_center()
                .justify_center()
                .min_h(px(200.0))
                .child(
                    div()
                        .text_3xl()
                        .child("🔍"),
                )
                .child(
                    div()
                        .text_sm()
                        .text_color(theme.muted_foreground)
                        .child("No icons found"),
                )
                .child(
                    div()
                        .text_xs()
                        .text_color(theme.muted_foreground)
                        .child("Try a different search term or filter"),
                )
                .into_any_element();
        }

        for item in self.items {
            grid = grid.child(IconCell::new(item).render(theme));
        }

        grid.into_any_element()
    }
}

/// Individual icon cell in the grid
struct IconCell {
    item: IconGridItem,
}

impl IconCell {
    fn new(item: IconGridItem) -> Self {
        Self { item }
    }

    fn render(self, theme: &Theme) -> impl IntoElement {
        let border_col = if self.item.selected {
            theme.primary
        } else {
            theme.border
        };
        let bg = if self.item.selected {
            theme.accent
        } else {
            theme.card
        };

        div()
            .flex()
            .flex_col()
            .items_center()
            .justify_center()
            .gap_2()
            .w(px(120.0))
            .h(px(140.0))
            .rounded(px(8.0))
            .bg(bg)
            .border_1()
            .border_color(border_col)
            // Icon preview area (larger)
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_center()
                    .size(px(80.0))
                    .child(self.render_icon_preview(theme)),
            )
            // Icon name
            .child(
                div()
                    .text_sm()
                    .text_color(theme.foreground)
                    .overflow_x_hidden()
                    .max_w(px(110.0))
                    .child(truncate_name(&self.item.name, 15)),
            )
    }

    fn render_icon_preview(&self, _theme: &Theme) -> impl IntoElement {
        // Now that we have AssetSource registered, svg().path() will work!
        let asset_path = format!("icons/{}.svg", self.item.name);
        
        // Note: GPUI's svg() seems to require a color even for colored SVGs
        // Using white as a "neutral" color, but GPUI may still override the SVG's colors
        div()
            .flex()
            .items_center()
            .justify_center()
            .size(px(64.0))
            .bg(gpui::rgb(0xf5f5f5))  // Light gray background
            .rounded(px(4.0))
            .child(
                svg()
                    .path(SharedString::from(asset_path))
                    .size(px(48.0))
                    .text_color(gpui::rgb(0x000000))  // Black - GPUI requires this
                    .flex_shrink_0(),
            )
            .into_any_element()
    }
}

/// Truncate a name for display in the grid cell
fn truncate_name(name: &str, max_len: usize) -> String {
    if name.len() <= max_len {
        name.to_string()
    } else {
        format!("{}…", &name[..max_len - 1])
    }
}
