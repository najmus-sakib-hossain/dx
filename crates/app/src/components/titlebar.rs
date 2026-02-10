use gpui::{div, prelude::*, px, IntoElement};
use crate::theme::Theme;

/// Window titlebar with system controls (minimize, maximize, close)
/// Note: Click handlers require View state management in GPUI
/// For now, this provides visual feedback only
pub struct TitleBar {
    title: String,
}

impl TitleBar {
    pub fn new(title: impl Into<String>) -> Self {
        Self {
            title: title.into(),
        }
    }

    pub fn render(self, theme: &Theme) -> impl IntoElement {
        let title = self.title.clone();
        
        div()
            .flex()
            .items_center()
            .justify_between()
            .h(px(40.0))
            .px_4()
            .bg(theme.background)
            .border_b_1()
            .border_color(theme.border)
            // Title section
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap_2()
                    .child(
                        div()
                            .text_sm()
                            .font_weight(gpui::FontWeight::SEMIBOLD)
                            .text_color(theme.foreground)
                            .child(title),
                    ),
            )
            // Window controls section
            .child(self.render_window_controls(theme))
    }

    fn render_window_controls(&self, theme: &Theme) -> impl IntoElement {
        div()
            .flex()
            .items_center()
            .gap_1()
            .child(WindowControlButton::new(WindowControl::Minimize).render(theme))
            .child(WindowControlButton::new(WindowControl::Maximize).render(theme))
            .child(WindowControlButton::new(WindowControl::Close).render(theme))
    }
}

/// Window control button types
#[derive(Clone, Copy)]
enum WindowControl {
    Minimize,
    Maximize,
    Close,
}

/// Individual window control button
struct WindowControlButton {
    control: WindowControl,
}

impl WindowControlButton {
    fn new(control: WindowControl) -> Self {
        Self { control }
    }

    fn render(self, theme: &Theme) -> impl IntoElement {
        let (icon, hover_bg) = match self.control {
            WindowControl::Minimize => ("−", theme.secondary),
            WindowControl::Maximize => ("□", theme.secondary),
            WindowControl::Close => ("×", theme.destructive),
        };

        div()
            .flex()
            .items_center()
            .justify_center()
            .w(px(40.0))
            .h(px(32.0))
            .rounded(px(4.0))
            .hover(move |style| style.bg(hover_bg))
            .cursor_pointer()
            .child(
                div()
                    .text_base()
                    .text_color(theme.foreground)
                    .child(icon),
            )
    }
}
