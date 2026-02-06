mod components;
mod theme;
mod views;

use gpui::{px, size, App, AppContext, Application, Bounds, WindowBounds, WindowOptions};
use theme::{Theme, ThemeMode};
use views::ChatView;

fn main() {
    Application::new().run(|cx: &mut App| {
        // Use dark theme as default
        let theme = Theme::new(ThemeMode::Dark);
        
        let bounds = Bounds::centered(None, size(px(1280.0), px(800.0)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                titlebar: None,
                ..Default::default()
            },
            |_, cx| cx.new(|_| ChatView::new(theme)),
        )
        .unwrap();
    });
}
