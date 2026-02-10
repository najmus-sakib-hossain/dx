use gpui::{div, prelude::*, px, Context, IntoElement, MouseButton, Window, FocusHandle, KeyDownEvent};
use std::sync::Arc;

use crate::components::icon_grid::{IconGrid, IconGridItem};
use crate::icons::data::{IconSource};
use crate::icons::IconDataLoader;
use crate::theme::Theme;

/// How many icons to display per page in the grid (reduced for better performance)
const ICONS_PER_PAGE: usize = 50;

/// Maximum total icons to load (to prevent lag)
const MAX_TOTAL_ICONS: usize = 5000;

/// The main icon picker view - equivalent of the www Next.js icon browser
pub struct IconPickerView {
    theme: Theme,
    /// All loaded icon data (shared reference)
    loader: Arc<IconDataLoader>,
    /// Current search query
    search_query: String,
    /// Focus handle for search input
    search_focus: FocusHandle,
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
    /// Cursor blink state for search input
    cursor_visible: bool,
}

impl IconPickerView {
    pub fn new(theme: Theme, loader: Arc<IconDataLoader>, cx: &mut Context<Self>) -> Self {
        let pack_names = loader.pack_names();
        let total_count = loader.total_icons().min(MAX_TOTAL_ICONS);

        // Initially show limited icons for performance
        let filtered_icons: Vec<usize> = (0..total_count).collect();
        
        let search_focus = cx.focus_handle();

        Self {
            theme,
            loader,
            search_query: String::new(),
            search_focus,
            selected_pack: None,
            selected_icon: None,
            filtered_icons,
            pack_names,
            total_count,
            page_offset: 0,
            cursor_visible: true,
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

    /// Set search query and update filter
    fn set_search_query(&mut self, query: String, cx: &mut Context<Self>) {
        self.search_query = query;
        self.update_filter();
        cx.notify();
    }

    /// Set selected pack and update filter
    fn set_selected_pack(&mut self, pack: Option<String>, cx: &mut Context<Self>) {
        self.selected_pack = pack;
        self.update_filter();
        cx.notify();
    }

    /// Go to next page
    fn next_page(&mut self, cx: &mut Context<Self>) {
        if self.page_offset + ICONS_PER_PAGE < self.filtered_icons.len() {
            self.page_offset += ICONS_PER_PAGE;
            cx.notify();
        }
    }

    /// Go to previous page
    fn prev_page(&mut self, cx: &mut Context<Self>) {
        if self.page_offset >= ICONS_PER_PAGE {
            self.page_offset -= ICONS_PER_PAGE;
            cx.notify();
        }
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

    fn render_search_area(&self, cx: &mut Context<Self>, window: &mut Window) -> impl IntoElement {
        let theme = self.theme.clone();
        
        div()
            .flex()
            .flex_col()
            .gap_3()
            .border_b_1()
            .border_color(theme.border)
            // Interactive search bar
            .child(self.render_search_bar_interactive(cx, window, &theme))
            // Pack filter chips with click handlers
            .child(self.render_pack_chips(cx, &theme))
    }
    
    fn render_search_input(&self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .flex_1()
            .items_center()
            .gap_2()
            .px_6()
            .py_3()
            .child(
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
                            .child("Search"),
                    )
                    .child(
                        div()
                            .flex_1()
                            .text_sm()
                            .text_color(if self.search_query.is_empty() {
                                theme.muted_foreground
                            } else {
                                theme.foreground
                            })
                            .child(if self.search_query.is_empty() {
                                "Click to search: home, arrow, github, or all icons".to_string()
                            } else {
                                format!("Searching: {} (click to change)", self.search_query)
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
                            .child("Cmd+K"),
                    ),
            )
    }
    
    fn render_search_bar_interactive(&self, cx: &mut Context<Self>, window: &mut Window, theme: &Theme) -> impl IntoElement {
        let search_focus = self.search_focus.clone();
        let is_focused = search_focus.is_focused(window);
        
        div()
            .flex()
            .flex_1()
            .items_center()
            .gap_2()
            .px_6()
            .py_3()
            .child(
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
                    .border_color(if is_focused {
                        theme.ring
                    } else {
                        theme.border
                    })
                    .cursor_text()
                    .track_focus(&search_focus)
                    .on_mouse_down(
                        MouseButton::Left,
                        cx.listener(|view, _event, window, cx| {
                            view.search_focus.focus(window, cx);
                        }),
                    )
                    .on_key_down(cx.listener(|view, event: &KeyDownEvent, _window, cx| {
                        let keystroke = &event.keystroke;
                        
                        // Handle backspace
                        if keystroke.key == "backspace" {
                            view.search_query.pop();
                            view.update_filter();
                            cx.notify();
                        }
                        // Handle regular character input
                        else if keystroke.key.len() == 1 && !keystroke.modifiers.control && !keystroke.modifiers.alt {
                            view.search_query.push_str(&keystroke.key);
                            view.update_filter();
                            cx.notify();
                        }
                        // Handle Escape to clear
                        else if keystroke.key == "escape" {
                            view.search_query.clear();
                            view.update_filter();
                            cx.notify();
                        }
                    }))
                    .child(
                        div()
                            .text_sm()
                            .text_color(theme.muted_foreground)
                            .child("Search"),
                    )
                    .child(
                        div()
                            .flex()
                            .items_center()
                            .gap_1()
                            .child(
                                div()
                                    .flex_1()
                                    .text_sm()
                                    .text_color(if self.search_query.is_empty() {
                                        theme.muted_foreground
                                    } else {
                                        theme.foreground
                                    })
                                    .child(if self.search_query.is_empty() {
                                        "Type to search icons...".to_string()
                                    } else {
                                        self.search_query.clone()
                                    }),
                            )
                            .when(is_focused, |this| {
                                this.child(
                                    div()
                                        .w(px(2.0))
                                        .h(px(16.0))
                                        .bg(theme.foreground)
                                        .child(""),
                                )
                            }),
                    )
                    .when(!self.search_query.is_empty(), |this| {
                        this.child(
                            div()
                                .text_xs()
                                .text_color(theme.muted_foreground)
                                .cursor_pointer()
                                .on_mouse_down(
                                    MouseButton::Left,
                                    cx.listener(|view, _event, _window, cx| {
                                        view.search_query.clear();
                                        view.update_filter();
                                        cx.notify();
                                    }),
                                )
                                .child("Clear"),
                        )
                    })
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .px_2()
                            .py_1()
                            .rounded(px(4.0))
                            .bg(theme.muted)
                            .child("Esc"),
                    ),
            )
    }
    
    fn render_pack_chips(&self, cx: &mut Context<Self>, theme: &Theme) -> impl IntoElement {
        let mut chips = div()
            .flex()
            .flex_wrap()
            .gap_2()
            .px_6()
            .py_3()
            .on_mouse_move(|_event, _window, _cx| {
                // Ensure hover updates in chips area
            });

        // "All" chip
        let all_active = self.selected_pack.is_none();
        chips = chips.child(self.render_pack_chip("All", all_active, None, cx, theme));

        // Show top 15 packs
        for pack_name in self.pack_names.iter().take(15) {
            let active = self
                .selected_pack
                .as_ref()
                .map(|p| p == pack_name)
                .unwrap_or(false);
            
            chips = chips.child(
                self.render_pack_chip(pack_name, active, Some(pack_name.clone()), cx, theme)
            );
        }

        chips
    }
    
    fn render_pack_chip(
        &self,
        label: &str,
        active: bool,
        pack: Option<String>,
        cx: &mut Context<Self>,
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
        
        let hover_bg = if active {
            theme.primary
        } else {
            theme.accent
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
            .on_mouse_move(|_event, _window, _cx| {
                // Trigger hover detection on mouse movement
            })
            .hover(move |style| {
                style
                    .bg(hover_bg)
            })
            .on_mouse_down(
                MouseButton::Left,
                cx.listener(move |view, _event, _window, cx| {
                    view.set_selected_pack(pack.clone(), cx);
                }),
            )
            .child(
                div()
                    .text_xs()
                    .text_color(fg)
                    .child(label.to_string()),
            )
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
        
        // Get the current page of filtered icons
        let start = self.page_offset;
        let end = (start + ICONS_PER_PAGE).min(self.filtered_icons.len());
        
        let visible_icons: Vec<IconGridItem> = self.filtered_icons[start..end]
            .iter()
            .filter_map(|&idx| icons.get(idx))
            .enumerate()
            .map(|(display_idx, icon)| {
                IconGridItem {
                    index: display_idx,
                    name: icon.name.clone(),
                    pack: icon.pack.clone(),
                    svg_body: icon.svg_body.clone(),
                    width: icon.width,
                    height: icon.height,
                    selected: self.selected_icon == Some(display_idx),
                }
            })
            .collect();

        IconGrid::new(visible_icons).render(&self.theme)
    }

    fn render_pagination(&self, cx: &mut Context<Self>) -> impl IntoElement {
        let total = self.filtered_icons.len();
        let page = self.page_offset / ICONS_PER_PAGE + 1;
        let total_pages = (total + ICONS_PER_PAGE - 1) / ICONS_PER_PAGE;
        
        let can_go_prev = self.page_offset > 0;
        let can_go_next = self.page_offset + ICONS_PER_PAGE < total;

        div()
            .flex()
            .items_center()
            .justify_center()
            .gap_4()
            .px_6()
            .py_3()
            .border_t_1()
            .border_color(self.theme.border)
            .on_mouse_move(|_event, _window, _cx| {
                // Ensure hover updates in pagination area
            })
            .child(
                div()
                    .px_3()
                    .py_1()
                    .rounded(px(6.0))
                    .bg(if can_go_prev {
                        self.theme.secondary
                    } else {
                        self.theme.muted
                    })
                    .when(can_go_prev, |div| {
                        div.cursor_pointer()
                            .on_mouse_move(|_event, _window, _cx| {
                                // Trigger hover detection
                            })
                            .hover(move |style| {
                                style.bg(self.theme.accent)
                            })
                            .on_mouse_down(
                                MouseButton::Left,
                                cx.listener(|view, _event, _window, cx| {
                                    view.prev_page(cx);
                                }),
                            )
                    })
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child("Previous"),
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
                        if can_go_next {
                            self.theme.secondary
                        } else {
                            self.theme.muted
                        },
                    )
                    .when(can_go_next, |div| {
                        div.cursor_pointer()
                            .on_mouse_move(|_event, _window, _cx| {
                                // Trigger hover detection
                            })
                            .hover(move |style| {
                                style.bg(self.theme.accent)
                            })
                            .on_mouse_down(
                                MouseButton::Left,
                                cx.listener(|view, _event, _window, cx| {
                                    view.next_page(cx);
                                }),
                            )
                    })
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.foreground)
                            .child("Next"),
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

    fn render_main_content(&self, cx: &mut Context<Self>, window: &mut Window) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .h_full()
            .bg(self.theme.background)
            .child(self.render_header())
            .child(self.render_search_area(cx, window))
            .child(
                div()
                    .flex_1()
                    .child(self.render_icon_grid()),
            )
            .child(self.render_pagination(cx))
    }
}

impl Render for IconPickerView {
    fn render(&mut self, window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .size_full()
            .bg(self.theme.background)
            .on_mouse_move(cx.listener(|_view, _event, _window, cx| {
                // Force repaint on mouse movement to update hover states
                cx.notify();
            }))
            .child(self.render_main_content(cx, window))
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
