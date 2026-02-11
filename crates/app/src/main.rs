mod assets;
mod components;
mod icons;
mod theme;
mod views;

use assets::{Assets, DynamicSvgAssets};
use gpui::{px, size, App, AppContext, Application, Bounds, WindowBounds, WindowOptions};
use icons::IconDataLoader;
use std::sync::Arc;
use theme::{Theme, ThemeMode};
use views::IconPickerView;

fn main() {
    // Detect project root (look for Cargo.toml in ancestors)
    let project_root = detect_project_root()
        .unwrap_or_else(|| std::env::current_dir().expect("Could not determine current directory"));

    // Load all icon data before launching the UI
    let mut loader = IconDataLoader::new(&project_root);
    let _ = loader.load_all(); // Ignore errors silently

    // Create dynamic SVG asset source and register all loaded icons
    let dynamic_assets = DynamicSvgAssets::new();
    for icon in loader.icons() {
        let path = format!("icons/{}/{}.svg", icon.pack, icon.name);
        dynamic_assets.register_svg(path, &icon.svg_body, icon.width, icon.height);
    }

    let loader = Arc::new(loader);

    // Create application with asset sources
    Application::new()
        .with_assets(Assets)
        .with_assets(dynamic_assets)
        .run(move |cx: &mut App| {
            // Use dark theme as default
            let theme = Theme::new(ThemeMode::Dark);
            let loader = loader.clone();

            let bounds = Bounds::centered(None, size(px(1440.0), px(900.0)), cx);
            cx.open_window(
                WindowOptions {
                    window_bounds: Some(WindowBounds::Windowed(bounds)),
                    titlebar: Some(gpui::TitlebarOptions {
                        title: Some("DX Icon Picker".into()),
                        appears_transparent: false,
                        traffic_light_position: None,
                    }),
                    ..Default::default()
                },
                move |_, cx| cx.new(|cx| IconPickerView::new(theme, loader, cx)),
            )
            .unwrap();
        });
}

/// Walk up from the current exe or cwd to find the DX monorepo root
fn detect_project_root() -> Option<std::path::PathBuf> {
    // Try from current directory first
    let mut dir = std::env::current_dir().ok()?;
    loop {
        // Check for the monorepo marker files
        if dir.join("Cargo.toml").exists()
            && dir.join("apps").exists()
            && dir.join("crates").exists()
        {
            return Some(dir);
        }
        if !dir.pop() {
            break;
        }
    }

    // Try from executable location
    if let Ok(exe) = std::env::current_exe() {
        let mut dir = exe.parent()?.to_path_buf();
        loop {
            if dir.join("Cargo.toml").exists()
                && dir.join("apps").exists()
                && dir.join("crates").exists()
            {
                return Some(dir);
            }
            if !dir.pop() {
                break;
            }
        }
    }

    None
}
