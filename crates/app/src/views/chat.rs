#![allow(dead_code)]

use gpui::{div, prelude::*, px, Context, IntoElement, Window};
use crate::components::{
    Avatar, AvatarSize, Badge, BadgeVariant, Button, ButtonVariant, Card, CardHeader,
    InputArea, Kbd, Label, Separator, Sidebar, SidebarItem, SidebarSection, SidebarThread,
};
use crate::components::ui::{
    Breadcrumb, Container, EmptyState, HStack, Stat, StatTrend, Tabs, VStack,
};
use crate::theme::Theme;

/// The main chat view — demonstrates comprehensive usage of the component library.
pub struct ChatView {
    theme: Theme,
}

impl ChatView {
    pub fn new(theme: Theme) -> Self {
        Self { theme }
    }

    // ── Header ──

    fn render_header(&self) -> impl IntoElement {
        HStack::new()
            .gap(px(12.0))
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_between()
                    .flex_1()
                    .px(px(24.0))
                    .py(px(12.0))
                    .border_b_1()
                    .border_color(self.theme.border)
                    .child(
                        HStack::new()
                            .gap(px(12.0))
                            .child(
                                Breadcrumb::new()
                                    .item("Home")
                                    .item("Threads")
                                    .item("New thread")
                                    .render(&self.theme),
                            )
                            .render(),
                    )
                    .child(
                        HStack::new()
                            .gap(px(8.0))
                            .child(Badge::secondary("Draft").render(&self.theme))
                            .child(
                                Button::outline("Open")
                                    .with_icon_left("📂")
                                    .size(crate::components::ButtonSize::Sm)
                                    .render(&self.theme),
                            )
                            .child(
                                Button::primary("Create PR")
                                    .size(crate::components::ButtonSize::Sm)
                                    .render(&self.theme),
                            )
                            .render(),
                    ),
            )
            .render()
    }

    // ── Hero / Center Content ──

    fn render_center_content(&self) -> impl IntoElement {
        VStack::new()
            .gap(px(32.0))
            .child(
                div()
                    .flex()
                    .flex_col()
                    .flex_1()
                    .items_center()
                    .justify_center()
                    .child(self.render_hero())
                    .child(div().h(px(24.0)))
                    .child(
                        div()
                            .font_size(px(14.0))
                            .text_color(self.theme.muted_foreground)
                            .child("Explore more"),
                    )
                    .child(div().h(px(16.0)))
                    .child(self.render_suggestions()),
            )
            .render()
    }

    fn render_hero(&self) -> impl IntoElement {
        VStack::new()
            .gap(px(12.0))
            .child(
                div()
                    .flex()
                    .flex_col()
                    .items_center()
                    .gap(px(12.0))
                    .child(
                        Avatar::new()
                            .fallback("🤖")
                            .size(AvatarSize::Xl)
                            .render(&self.theme),
                    )
                    .child(
                        div()
                            .text_3xl()
                            .font_weight(gpui::FontWeight::BOLD)
                            .text_color(self.theme.foreground)
                            .child("Let's build"),
                    )
                    .child(
                        HStack::new()
                            .gap(px(4.0))
                            .child(
                                Badge::outline("lawn").render(&self.theme),
                            )
                            .child(
                                div()
                                    .font_size(px(12.0))
                                    .text_color(self.theme.muted_foreground)
                                    .child("▼"),
                            )
                            .render(),
                    ),
            )
            .render()
    }

    fn render_suggestions(&self) -> impl IntoElement {
        HStack::new()
            .gap(px(16.0))
            .child(
                Card::simple("🎮", "Build a classic Snake game in this repo.")
                    .render(&self.theme),
            )
            .child(
                Card::simple("📄", "Create a one-page PDF that summarizes this app.")
                    .render(&self.theme),
            )
            .child(
                Card::simple("📊", "Summarize last week's PRs by teammate and theme.")
                    .render(&self.theme),
            )
            .render()
    }

    // ── Sidebar ──

    fn render_sidebar(&self) -> impl IntoElement {
        Sidebar::new(self.theme.clone())
            .header_item(SidebarItem::new("📝", "New thread"))
            .header_item(SidebarItem::new("⚙️", "Automations"))
            .header_item(SidebarItem::new("🎯", "Skills"))
            .section(
                SidebarSection::new()
                    .title("lawn")
                    .threads(vec![
                        ("Design blog post organization", "2h"),
                        ("Add archived blog post flow", "2h"),
                        ("Research blog overhaul options", "4h"),
                    ]),
            )
            .section(
                SidebarSection::new()
                    .title("t3.gg"),
            )
            .section(
                SidebarSection::new()
                    .title("t3-native-proto")
                    .threads(vec![
                        ("Reorganize auth UI to use metad...", "6d"),
                        ("I have done a bunch of research ...", "4d"),
                        ("Fix chat layout when keyboard o...", "5d"),
                        ("Make auth session persist", "5d"),
                        ("Fix markdown and simplify storage", "5d"),
                    ]),
            )
            .footer(
                HStack::new()
                    .gap(px(8.0))
                    .child(
                        Avatar::new()
                            .fallback("P")
                            .size(AvatarSize::Sm)
                            .render(&self.theme),
                    )
                    .child(
                        div()
                            .font_size(px(14.0))
                            .text_color(self.theme.sidebar_foreground)
                            .child("Personal"),
                    )
                    .render(),
            )
            .render()
    }

    // ── Main Content ──

    fn render_main_content(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .h_full()
            .bg(self.theme.background)
            .child(self.render_header())
            .child(
                div()
                    .flex()
                    .flex_col()
                    .flex_1()
                    .items_center()
                    .justify_center()
                    .child(self.render_center_content()),
            )
            .child(InputArea::new(self.theme.clone()).render())
    }
}

impl Render for ChatView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .size_full()
            .bg(self.theme.background)
            .child(self.render_sidebar())
            .child(self.render_main_content())
    }
}
