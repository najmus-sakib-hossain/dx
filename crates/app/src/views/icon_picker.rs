use gpui::{div, prelude::*, px, Context, IntoElement, Window};
use std::sync::Arc;

use crate::components::icon_grid::{IconGrid, IconGridItem};
use crate::components::search_bar::SearchBar;
use crate::icons::data::{IconSource, LoadedIcon};
use crate::icons::IconDataLoader;
use crate::theme::Theme;

/// How many icons to display per page in the grid
const ICONS_PER_PAGE: usize = 200;

/// The main icon picker view - equivalent of the www Next.js icon browser
pub struct IconPickerView {
    theme: Theme,
    /// All loaded icon data (shared reference)
    loader: Arc<IconDataLoader>,
    /// Current search query
    search_query: String,
    /// Currently selected pack filter (None = all packs)
    selected_pack: Option<String>,
    /// Currently selected icon (for detail panel)
    selected_icon: Option<usize>,
    /// Filtered icon indices (result of search + pack filter)
    filtered_icons: Vec<usize>,
    /// Available pack names for filter
    pack_names: Vec<String>,
    /// Total icon count
    total_count: usize,
    /// Current page offset for pagination
    page_offset: usize,
}

impl IconPickerView {
    pub fn new(theme: Theme, loader: Arc<IconDataLoader>) -> Self {
        let pack_names = loader.pack_names();
        let total_count = loader.total_icons();

        // Initially show all icons
        let filtered_icons: Vec<usize> = (0..total_count).collect();

        Self {
            theme,
            loader,
            search_query: String::new(),
            selected_pack: None,
            selected_icon: None,
            filtered_icons,
            pack_names,
            total_count,
            page_offset: 0,
        }
    }

    /// Update the filtered icon list based on current search query and pack filter
    fn update_filter(&mut self) {
        let query = self.search_query.to_lowercase();
        let icons = self.loader.icons();

        self.filtered_icons = icons
            .iter()
            .enumerate()
            .filter(|(_, icon)| {
                // Pack filter
                if let Some(ref pack) = self.selected_pack {
                    if &icon.pack != pack {
                        return false;
                    }
                }
                // Search filter
                if !query.is_empty() {
                    let name_lower = icon.name.to_lowercase();
                    let pack_lower = icon.pack.to_lowercase();
                    if !name_lower.contains(&query) && !pack_lower.contains(&query) {
                        // Try fuzzy
                        return fuzzy_contains(&name_lower, &query);
                    }
                }
                true
            })
            .map(|(idx, _)| idx)
            .collect();

        // Reset pagination
        self.page_offset = 0;
        self.selected_icon = None;
    }

    fn render_header(&self) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .justify_between()
            .px_6()
            .py_4()
            .border_b_1()
            .border_color(self.theme.border)
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap_3()
                    .child(
                        div()
                            .text_xl()
                            .text_color(self.theme.foreground)
                            .child("🎨"),
                    )
                    .child(
                        div()
                            .flex()
                            .flex_col()
                            .child(
                                div()
                                    .text_base()
                                    .text_color(self.theme.foreground)
                                    .child("DX Icon Picker"),
                            )
                            .child(
                                div()
                                    .text_xs()
                                    .text_color(self.theme.muted_foreground)
                                    .child(format!(
                                        "{} icons across {} packs",
                                        self.total_count,
                                        self.pack_names.len()
                                    )),
                            ),
                    ),
            )
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap_2()
                    .child(
                        div()
                            .text_xs()
                            .text_color(self.theme.muted_foreground)
                            .child(format!("{} results", self.filtered_icons.len())),
                    ),
            )
    }

    fn render_search_area(&self) -> impl IntoElement {
        SearchBar::new(
            self.search_query.clone(),
            self.selected_pack.clone(),
            self.pack_names.clone(),
        )
        .render(&self.theme)
    }

    fn render_pack_filters(&self) -> impl IntoElement {
        let theme = self.theme.clone();
        let mut chips = div()
            .flex()
            .flex_wrap()
            .gap_2()
            .px_6()
            .py_3()
            .border_b_1()
            .border_color(theme.border);

        // "All" chip
        let all_active = self.selected_pack.is_none();
        chips = chips.child(
            PackChip::new("All", all_active, self.total_count).render(&theme),
        );

        // Pack chips (show top packs by icon count)
        let mut pack_info: Vec<(&str, usize)> = self
            .pack_names
            .iter()
            .map(|name| {
                let count = self
                    .loader
                    .icons()
                    .iter()
                    .filter(|i| &i.pack == name)
                    .count();
                (name.as_str(), count)
            })
            .collect();
        pack_info.sort_by(|a, b| b.1.cmp(&a.1));

        // Show top 20 packs
        for (pack_name, count) in pack_info.iter().take(20) {
            let active = self
                .selected_pack
                .as_ref()
                .map(|p| p == *pack_name)
                .unwrap_or(false);
            chips = chips.child(PackChip::new(*pack_name, active, *count).render(&theme));
        }

        chips
    }

    fn render_icon_grid(&self) -> impl IntoElement {
        let icons = self.loader.icons();
        let end = (self.page_offset + ICONS_PER_PAGE).min(self.filtered_icons.len());
        let visible_range = &self.filtered_icons[self.page_offset..end];

        let items: Vec<IconGridItem> = visible_range
            .iter()
            .map(|&idx| {
                let icon = &icons[idx];
                IconGridItem {
                    index: idx,
                    name: icon.name.clone(),
                    pack: icon.pack.clone(),
                    svg_body: icon.svg_body.clone(),
                    width: icon.width,
                    height: icon.height,
                    selected: self.selected_icon == Some(idx),
                }
            })
            .collect();

        IconGrid::new(items).render(&self.theme)
    }

    fn render_pagination(&self) -> impl IntoElement {
        let total = self.filtered_icons.len();
        let page = self.page_offset / ICONS_PER_PAGE + 1;
        let total_pages = (total + ICONS_PER_PAGE - 1) / ICONS_PER_PAGE;

        div()
            .flex()
            .items_center()
            .justify_center()
            .gap_4()
            .px_6()
            .py_3()
            .border_t_1()
            .border_color(self.theme.border)
            .child(
                div()
                    .px_3()
                    .py_1()
                    .rounded(px(6.0))
                    .bg(if self.page_offset > 0 {
                        self.theme.secondary
                    } else {
                        self.theme.muted
                    })
                    .cursor_pointer()
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child("← Prev"),
                    ),
            )
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.muted_foreground)
                    .child(format!("Page {} of {}", page, total_pages.max(1))),
            )
            .child(
                div()
                    .px_3()
                    .py_1()
                    .rounded(px(6.0))
                    .bg(
                        if self.page_offset + ICONS_PER_PAGE < total {
                            self.theme.secondary
                        } else {
                            self.theme.muted
                        },
                    )
                    .cursor_pointer()
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child("Next →"),
                    ),
            )
    }

    fn render_detail_panel(&self) -> impl IntoElement {
        if let Some(idx) = self.selected_icon {
            let icons = self.loader.icons();
            if let Some(icon) = icons.get(idx) {
                return div()
                    .flex()
                    .flex_col()
                    .w(px(280.0))
                    .h_full()
                    .bg(self.theme.card)
                    .border_l_1()
                    .border_color(self.theme.border)
                    .child(self.render_detail_content(icon))
                    .into_any_element();
            }
        }

        // Empty detail panel placeholder
        div()
            .flex()
            .flex_col()
            .w(px(280.0))
            .h_full()
            .bg(self.theme.card)
            .border_l_1()
            .border_color(self.theme.border)
            .items_center()
            .justify_center()
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.muted_foreground)
                    .child("Select an icon to view details"),
            )
            .into_any_element()
    }

    fn render_detail_content(&self, icon: &LoadedIcon) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_4()
            .p_6()
            // Large preview
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_center()
                    .size(px(120.0))
                    .mx_auto()
                    .rounded(px(12.0))
                    .bg(self.theme.background)
                    .border_1()
                    .border_color(self.theme.border)
                    .child(
                        div()
                            .text_3xl()
                            .text_color(self.theme.foreground)
                            .child("📎"), // Placeholder for SVG preview
                    ),
            )
            // Icon name
            .child(
                div()
                    .flex()
                    .flex_col()
                    .gap_1()
                    .child(
                        div()
                            .text_xs()
                            .text_color(self.theme.muted_foreground)
                            .child("Name"),
                    )
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child(icon.name.clone()),
                    ),
            )
            // Pack
            .child(
                div()
                    .flex()
                    .flex_col()
                    .gap_1()
                    .child(
                        div()
                            .text_xs()
                            .text_color(self.theme.muted_foreground)
                            .child("Pack"),
                    )
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child(icon.pack.clone()),
                    ),
            )
            // Source
            .child(
                div()
                    .flex()
                    .flex_col()
                    .gap_1()
                    .child(
                        div()
                            .text_xs()
                            .text_color(self.theme.muted_foreground)
                            .child("Source"),
                    )
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child(icon.source.to_string()),
                    ),
            )
            // Dimensions
            .child(
                div()
                    .flex()
                    .flex_col()
                    .gap_1()
                    .child(
                        div()
                            .text_xs()
                            .text_color(self.theme.muted_foreground)
                            .child("Dimensions"),
                    )
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child(format!("{}×{}", icon.width, icon.height)),
                    ),
            )
            // Copy SVG button
            .child(
                div()
                    .mt_4()
                    .px_4()
                    .py_2()
                    .rounded(px(6.0))
                    .bg(self.theme.primary)
                    .cursor_pointer()
                    .flex()
                    .items_center()
                    .justify_center()
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.primary_foreground)
                            .child("Copy SVG"),
                    ),
            )
            // Copy ID button
            .child(
                div()
                    .px_4()
                    .py_2()
                    .rounded(px(6.0))
                    .bg(self.theme.secondary)
                    .cursor_pointer()
                    .flex()
                    .items_center()
                    .justify_center()
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.secondary_foreground)
                            .child(format!("Copy: {}", icon.id)),
                    ),
            )
    }

    fn render_sidebar(&self) -> impl IntoElement {
        let theme = self.theme.clone();
        let mut sidebar = div()
            .flex()
            .flex_col()
            .w(px(220.0))
            .h_full()
            .bg(theme.sidebar)
            .border_r_1()
            .border_color(theme.sidebar_border);

        // Header
        sidebar = sidebar.child(
            div()
                .px_4()
                .py_4()
                .border_b_1()
                .border_color(theme.sidebar_border)
                .child(
                    div()
                        .text_sm()
                        .text_color(theme.sidebar_foreground)
                        .child("📦 Icon Packs"),
                ),
        );

        // Source sections
        sidebar = sidebar.child(self.render_source_section("www/icons", IconSource::WwwIcons));
        sidebar = sidebar.child(self.render_source_section("www/svgl", IconSource::WwwSvgl));
        sidebar = sidebar.child(self.render_source_section("crate/data", IconSource::CrateData));

        // Stats at bottom
        sidebar = sidebar.child(
            div()
                .mt_auto()
                .px_4()
                .py_3()
                .border_t_1()
                .border_color(theme.sidebar_border)
                .child(
                    div()
                        .text_xs()
                        .text_color(theme.muted_foreground)
                        .child(format!("Total: {} icons", self.total_count)),
                )
                .child(
                    div()
                        .text_xs()
                        .text_color(theme.muted_foreground)
                        .child(format!("Packs: {}", self.pack_names.len())),
                ),
        );

        sidebar
    }

    fn render_source_section(&self, label: &str, source: IconSource) -> impl IntoElement {
        let theme = self.theme.clone();
        let packs_for_source: Vec<&str> = self
            .loader
            .packs()
            .iter()
            .filter(|p| p.source == source)
            .map(|p| p.prefix.as_str())
            .collect();

        let count = packs_for_source.len();

        div()
            .flex()
            .flex_col()
            .px_4()
            .py_2()
            .border_b_1()
            .border_color(theme.sidebar_border)
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .child(label.to_string()),
                    )
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .child(format!("{}", count)),
                    ),
            )
    }

    fn render_main_content(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .h_full()
            .overflow_hidden()
            .bg(self.theme.background)
            .child(self.render_header())
            .child(self.render_search_area())
            .child(self.render_pack_filters())
            .child(
                div()
                    .flex_1()
                    .overflow_hidden()
                    .child(self.render_icon_grid()),
            )
            .child(self.render_pagination())
    }
}

impl Render for IconPickerView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .size_full()
            .bg(self.theme.background)
            .child(self.render_sidebar())
            .child(self.render_main_content())
            .child(self.render_detail_panel())
    }
}

// -- Helper components --

struct PackChip {
    label: String,
    active: bool,
    count: usize,
}

impl PackChip {
    fn new(label: impl Into<String>, active: bool, count: usize) -> Self {
        Self {
            label: label.into(),
            active,
            count,
        }
    }

    fn render(self, theme: &Theme) -> impl IntoElement {
        let bg = if self.active {
            theme.primary
        } else {
            theme.secondary
        };
        let fg = if self.active {
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
                    .child(self.label),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(theme.muted_foreground)
                    .child(format!("({})", self.count)),
            )
    }
}

/// Simple fuzzy match: check if all chars of query appear in order in target
fn fuzzy_contains(target: &str, query: &str) -> bool {
    let mut target_chars = target.chars();
    for qc in query.chars() {
        loop {
            match target_chars.next() {
                Some(tc) if tc == qc => break,
                Some(_) => continue,
                None => return false,
            }
        }
    }
    true
}
