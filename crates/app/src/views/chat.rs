use gpui::{div, prelude::*, px, Context, IntoElement, Window};
use crate::components::{Button, Card, InputArea, Sidebar};
use crate::theme::Theme;

pub struct ChatView {
    theme: Theme,
}

impl ChatView {
    pub fn new(theme: Theme) -> Self {
        Self { theme }
    }

    fn render_header(&self) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .justify_between()
            .px_6()
            .py_3()
            .border_b_1()
            .border_color(self.theme.border)
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.foreground)
                    .child("New thread"),
            )
            .child(
                div()
                    .flex()
                    .gap_3()
                    .items_center()
                    .child(Button::new("📂 Open").secondary().render(&self.theme))
                    .child(
                        div()
                            .text_sm()
                            .text_color(self.theme.muted_foreground)
                            .child("Create PR"),
                    ),
            )
    }

    fn render_center_content(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .items_center()
            .justify_center()
            .gap_8()
            .child(self.render_hero())
            .child(
                div()
                    .text_sm()
                    .text_color(self.theme.muted_foreground)
                    .child("Explore more"),
            )
            .child(self.render_suggestions())
    }

    fn render_hero(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .items_center()
            .gap_3()
            .child(
                div()
                    .size(px(64.0))
                    .rounded(px(32.0))
                    .bg(self.theme.card)
                    .border_2()
                    .border_color(self.theme.border)
                    .flex()
                    .items_center()
                    .justify_center()
                    .child(div().text_3xl().child("🤖")),
            )
            .child(
                div()
                    .text_3xl()
                    .text_color(self.theme.foreground)
                    .child("Let's build"),
            )
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap_1()
                    .child(
                        div()
                            .text_base()
                            .text_color(self.theme.muted_foreground)
                            .child("lawn"),
                    )
                    .child(
                        div()
                            .text_base()
                            .text_color(self.theme.muted_foreground)
                            .child("▼"),
                    ),
            )
    }

    fn render_suggestions(&self) -> impl IntoElement {
        div()
            .flex()
            .gap_4()
            .child(Card::new("🎮", "Build a classic Snake game in this repo.").render(&self.theme))
            .child(Card::new("📄", "Create a one-page $pdf that summarizes this app.").render(&self.theme))
            .child(Card::new("📊", "Summarize last week's PRs by teammate and theme.").render(&self.theme))
    }

    fn render_main_content(&self) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .flex_1()
            .h_full()
            .bg(self.theme.background)
            .child(self.render_header())
            .child(self.render_center_content())
            .child(InputArea::new(self.theme.clone()).render())
    }
}

impl Render for ChatView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .size_full()
            .bg(self.theme.background)
            .child(Sidebar::new(self.theme.clone()).render())
            .child(self.render_main_content())
    }
}
