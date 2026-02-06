use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

pub struct Sidebar {
    theme: Theme,
}

impl Sidebar {
    pub fn new(theme: Theme) -> Self {
        Self { theme }
    }

    pub fn render(self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .w(px(240.0))
            .h_full()
            .bg(self.theme.sidebar)
            .border_r_1()
            .border_color(self.theme.sidebar_border)
            .child(self.render_header())
            .child(self.render_content())
            .child(self.render_footer())
    }

    fn render_header(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_1()
            .px_3()
            .py_3()
            .border_b_1()
            .border_color(self.theme.sidebar_border)
            .child(SidebarItem::new("📝", "New thread").render(&self.theme))
            .child(SidebarItem::new("⚙️", "Automations").render(&self.theme))
            .child(SidebarItem::new("🎯", "Skills").render(&self.theme))
    }

    fn render_content(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .overflow_hidden()
            .child(SidebarSection::new("lawn", vec![
                ("Design blog post organization", "2h"),
                ("Add archived blog post flow", "2h"),
                ("Research blog overhaul options", "4h"),
                ("Research blog overhaul options", "4h"),
            ]).render(&self.theme))
            .child(SidebarSection::new("t3.gg", vec![]).render(&self.theme))
            .child(SidebarSection::new("t3-native-proto", vec![
                ("Reorganize auth UI to use metad...", "6d"),
                ("I have done a bunch of research ...", "4d"),
                ("Fix chat layout when keyboard o...", "5d"),
                ("Make auth session persist", "5d"),
                ("Fix markdown and simplify storage", "5d"),
            ]).render(&self.theme))
    }

    fn render_footer(&self) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .gap_2()
            .px_3()
            .py_3()
            .border_t_1()
            .border_color(self.theme.sidebar_border)
            .child(div().text_sm().child("👤"))
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.sidebar_foreground)
                    .child("Personal"),
            )
    }
}

pub struct SidebarItem {
    icon: String,
    text: String,
}

impl SidebarItem {
    pub fn new(icon: impl Into<String>, text: impl Into<String>) -> Self {
        Self {
            icon: icon.into(),
            text: text.into(),
        }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .gap_2()
            .px_2()
            .py_2()
            .rounded(px(6.0))
            .hover(move |style| style.bg(theme.sidebar_accent))
            .cursor_pointer()
            .child(div().text_sm().child(self.icon))
            .child(
                div()
                    .text_sm()
                    .text_color(theme.sidebar_foreground)
                    .child(self.text),
            )
    }
}

pub struct SidebarSection {
    title: String,
    threads: Vec<(String, String)>,
}

impl SidebarSection {
    pub fn new(title: impl Into<String>, threads: Vec<(&str, &str)>) -> Self {
        Self {
            title: title.into(),
            threads: threads.into_iter()
                .map(|(text, time)| (text.to_string(), time.to_string()))
                .collect(),
        }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .py_2()
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .px_3()
                    .py_1()
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .child(self.title.clone()),
                    )
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .child(if self.threads.is_empty() { "No threads" } else { "" }),
                    ),
            )
            .children(self.threads.into_iter().map(|(text, time)| {
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .px_3()
                    .py_2()
                    .hover(move |style| style.bg(theme.sidebar_accent))
                    .cursor_pointer()
                    .child(
                        div()
                            .text_sm()
                            .text_color(theme.sidebar_foreground)
                            .child(text),
                    )
                    .child(
                        div()
                            .text_xs()
                            .text_color(theme.muted_foreground)
                            .child(time),
                    )
            }))
    }
}
