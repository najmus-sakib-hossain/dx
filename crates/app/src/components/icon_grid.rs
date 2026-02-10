use gpui::{div, svg, prelude::*, px, IntoElement, MouseButton, SharedString};
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
        
        let hover_bg = theme.destructive;  // Danger/destructive color on hover
        let hover_border = theme.destructive;
        
        let icon_name = self.item.name.clone();
        let icon_pack = self.item.pack.clone();

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
            .hover(move |style| {
                style
                    .bg(hover_bg)
                    .border_color(hover_border)
            })
            .cursor_pointer()
            .on_mouse_down(MouseButton::Left, move |_event, _window, _cx| {
                // Icon clicked - in a full implementation, this would:
                // 1. Copy icon name to clipboard
                // 2. Show icon details
                // 3. Update selection state
                println!("Icon clicked: {} ({})", icon_name, icon_pack);
            })
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

    fn render_icon_preview(&self, theme: &Theme) -> impl IntoElement {
        // Use the dynamic asset path format: icons/{pack}/{name}.svg
        let asset_path = SharedString::from(format!("icons/{}/{}.svg", self.item.pack, self.item.name));
        
        svg()
            .path(asset_path)
            .text_color(theme.foreground)  // Monochrome icons will inherit this color
            .size(px(64.0))
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
