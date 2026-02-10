use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

/// A single icon to render in the grid
#[derive(Debug, Clone)]
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
            .gap_1()
            .w(px(80.0))
            .h(px(88.0))
            .rounded(px(8.0))
            .bg(bg)
            .border_1()
            .border_color(border_col)
            .cursor_pointer()
            .hover(move |style| style.bg(theme.accent).border_color(theme.ring))
            // Icon preview area
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_center()
                    .size(px(36.0))
                    .child(self.render_icon_preview(theme)),
            )
            // Icon name (truncated)
            .child(
                div()
                    .text_xs()
                    .text_color(theme.muted_foreground)
                    .overflow_x_hidden()
                    .max_w(px(72.0))
                    .child(truncate_name(&self.item.name, 10)),
            )
    }

    fn render_icon_preview(&self, theme: &Theme) -> impl IntoElement {
        // GPUI's svg() element loads from asset paths, not inline SVG strings.
        // For now, render a text representation. In a full implementation,
        // we'd write temporary SVG files or use a custom Element to paint paths.
        //
        // We display the first few meaningful characters of the icon name as a
        // visual placeholder, styled to look like an icon cell.

        let display_char = get_icon_emoji(&self.item.pack, &self.item.name);

        div()
            .flex()
            .items_center()
            .justify_center()
            .size(px(32.0))
            .rounded(px(4.0))
            .text_color(theme.foreground)
            .text_base()
            .child(display_char)
    }
}

/// Get a representative emoji/character for an icon based on its pack and name
fn get_icon_emoji(pack: &str, name: &str) -> String {
    // Map common icon names to emojis for visual representation
    let name_lower = name.to_lowercase();

    if name_lower.contains("home") || name_lower.contains("house") {
        return "🏠".to_string();
    }
    if name_lower.contains("search") || name_lower.contains("find") {
        return "🔍".to_string();
    }
    if name_lower.contains("user") || name_lower.contains("person") || name_lower.contains("account") {
        return "👤".to_string();
    }
    if name_lower.contains("settings") || name_lower.contains("gear") || name_lower.contains("cog") {
        return "⚙️".to_string();
    }
    if name_lower.contains("star") || name_lower.contains("favorite") {
        return "⭐".to_string();
    }
    if name_lower.contains("heart") || name_lower.contains("love") {
        return "❤️".to_string();
    }
    if name_lower.contains("mail") || name_lower.contains("email") || name_lower.contains("envelope") {
        return "📧".to_string();
    }
    if name_lower.contains("phone") || name_lower.contains("call") {
        return "📱".to_string();
    }
    if name_lower.contains("camera") || name_lower.contains("photo") {
        return "📷".to_string();
    }
    if name_lower.contains("file") || name_lower.contains("document") {
        return "📄".to_string();
    }
    if name_lower.contains("folder") || name_lower.contains("directory") {
        return "📁".to_string();
    }
    if name_lower.contains("lock") || name_lower.contains("secure") {
        return "🔒".to_string();
    }
    if name_lower.contains("trash") || name_lower.contains("delete") || name_lower.contains("bin") {
        return "🗑️".to_string();
    }
    if name_lower.contains("edit") || name_lower.contains("pencil") || name_lower.contains("pen") {
        return "✏️".to_string();
    }
    if name_lower.contains("check") || name_lower.contains("done") || name_lower.contains("tick") {
        return "✅".to_string();
    }
    if name_lower.contains("close") || name_lower.contains("cancel") || name_lower.contains("x-") {
        return "❌".to_string();
    }
    if name_lower.contains("arrow") || name_lower.contains("chevron") {
        return "➡️".to_string();
    }
    if name_lower.contains("clock") || name_lower.contains("time") || name_lower.contains("timer") {
        return "🕐".to_string();
    }
    if name_lower.contains("calendar") || name_lower.contains("date") {
        return "📅".to_string();
    }
    if name_lower.contains("link") || name_lower.contains("chain") {
        return "🔗".to_string();
    }
    if name_lower.contains("globe") || name_lower.contains("world") || name_lower.contains("earth") {
        return "🌍".to_string();
    }
    if name_lower.contains("sun") || name_lower.contains("bright") {
        return "☀️".to_string();
    }
    if name_lower.contains("moon") || name_lower.contains("night") || name_lower.contains("dark") {
        return "🌙".to_string();
    }
    if name_lower.contains("cloud") || name_lower.contains("weather") {
        return "☁️".to_string();
    }
    if name_lower.contains("download") {
        return "⬇️".to_string();
    }
    if name_lower.contains("upload") {
        return "⬆️".to_string();
    }
    if name_lower.contains("play") || name_lower.contains("video") {
        return "▶️".to_string();
    }
    if name_lower.contains("music") || name_lower.contains("audio") || name_lower.contains("sound") {
        return "🎵".to_string();
    }
    if name_lower.contains("code") || name_lower.contains("terminal") || name_lower.contains("dev") {
        return "💻".to_string();
    }
    if name_lower.contains("git") || name_lower.contains("branch") {
        return "🔀".to_string();
    }
    if name_lower.contains("bug") || name_lower.contains("debug") {
        return "🐛".to_string();
    }
    if name_lower.contains("fire") || name_lower.contains("flame") || name_lower.contains("hot") {
        return "🔥".to_string();
    }
    if name_lower.contains("warning") || name_lower.contains("alert") || name_lower.contains("exclamation") {
        return "⚠️".to_string();
    }
    if name_lower.contains("info") || name_lower.contains("information") {
        return "ℹ️".to_string();
    }
    if name_lower.contains("help") || name_lower.contains("question") {
        return "❓".to_string();
    }

    // Fallback: use pack initial + icon initial
    match pack {
        "svgl" => "◆".to_string(),
        "lucide" => "◇".to_string(),
        "heroicons" | "heroicons-outline" | "heroicons-solid" => "◈".to_string(),
        "fa-solid" | "fa-regular" | "fa-brands" | "fa6-solid" | "fa6-regular" | "fa6-brands" => "◉".to_string(),
        _ => {
            // Use first char of icon name as fallback
            let c = name.chars().next().unwrap_or('●');
            c.to_uppercase().to_string()
        }
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
