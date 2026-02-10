use gpui::{div, prelude::*, px, Context, IntoElement, Window};
use std::sync::Arc;

use crate::components::icon_grid::{IconGrid, IconGridItem};
use crate::components::search_bar::SearchBar;
use crate::icons::data::{IconSource};
use crate::icons::IconDataLoader;
use crate::theme::Theme;

/// How many icons to display per page in the grid (reduced for better performance)
#[allow(dead_code)]
const ICONS_PER_PAGE: usize = 50;

/// Maximum total icons to load (to prevent lag)
const MAX_TOTAL_ICONS: usize = 10;

/// The main icon picker view - equivalent of the www Next.js icon browser
#[allow(dead_code)]
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
        let total_count = loader.total_icons().min(MAX_TOTAL_ICONS);

        // Initially show limited icons for performance
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
    #[allow(dead_code)]
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

    #[allow(dead_code)]
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

    #[allow(dead_code)]
    fn render_search_area(&self) -> impl IntoElement {
        SearchBar::new(
            self.search_query.clone(),
            self.selected_pack.clone(),
            self.pack_names.clone(),
        )
        .render(&self.theme)
    }

    #[allow(dead_code)]
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
        
        // Only show first 10 icons - these are now bundled as assets
        let visible_icons: Vec<IconGridItem> = icons
            .iter()
            .take(10)
            .enumerate()
            .map(|(idx, icon)| {
                IconGridItem {
                    index: idx,
                    name: icon.name.clone(),
                    pack: icon.pack.clone(),
                    svg_body: icon.svg_body.clone(),
                    width: icon.width,
                    height: icon.height,
                    selected: false,
                }
            })
            .collect();

        IconGrid::new(visible_icons).render(&self.theme)
    }

    #[allow(dead_code)]
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

    // Detail panel removed - not needed for simple 10 icon display

    #[allow(dead_code)]
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

    #[allow(dead_code)]
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

    #[allow(dead_code)]
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
            .flex_col()
            .size_full()
            .bg(self.theme.background)
            .items_center()
            .justify_center()
            .gap_4()
            // Simple title
            .child(
                div()
                    .text_2xl()
                    .text_color(self.theme.foreground)
                    .child(format!("DX Icon Viewer - {} SVG Icons", self.loader.total_icons())),
            )
            // Debug info
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.muted_foreground)
                    .child("Rendering SVG icons from bundled assets (like Zed does)"),
            )
            // Just the icon grid, nothing else
            .child(
                div()
                    .flex()
                    .flex_wrap()
                    .gap_4()
                    .p_4()
                    .child(self.render_icon_grid()),
            )
    }
}

// -- Helper components --

#[allow(dead_code)]
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
#[allow(dead_code)]
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
