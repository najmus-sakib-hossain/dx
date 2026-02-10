use gpui::{AssetSource, Result, SharedString, Task};
use rust_embed::RustEmbed;
use std::sync::Arc;

#[derive(RustEmbed)]
#[folder = "assets"]
pub struct Assets;

impl AssetSource for Assets {
    fn load(&self, path: &str) -> Result<Option<std::borrow::Cow<'static, [u8]>>> {
        // RustEmbed uses forward slashes.
        // GPUI paths usually match what you pass to .path()
        if let Some(file) = Assets::get(path) {
            Ok(Some(file.data))
        } else {
            Ok(None)
        }
    }

    fn list(&self, path: &str) -> Result<Vec<SharedString>> {
        Ok(Assets::iter()
            .filter(|p| p.starts_with(path))
            .map(|p| SharedString::from(p.to_string()))
            .collect())
    }
}

// Alternative: Directory-based AssetSource for development
#[allow(dead_code)]
pub struct DirectoryAssetSource {
    root: std::path::PathBuf,
}

#[allow(dead_code)]
impl DirectoryAssetSource {
    pub fn new(root: std::path::PathBuf) -> Self {
        Self { root }
    }
}

impl AssetSource for DirectoryAssetSource {
    fn load(&self, path: &str) -> Result<Option<std::borrow::Cow<'static, [u8]>>> {
        let full_path = self.root.join(path);
        match std::fs::read(full_path) {
            Ok(bytes) => Ok(Some(bytes.into())),
            Err(_) => Ok(None),
        }
    }

    fn list(&self, path: &str) -> Result<Vec<SharedString>> {
        let full_path = self.root.join(path);
        if let Ok(entries) = std::fs::read_dir(full_path) {
            Ok(entries
                .filter_map(|e| e.ok())
                .filter_map(|e| e.file_name().to_str().map(|s| SharedString::from(s.to_string())))
                .collect())
        } else {
            Ok(Vec::new())
        }
    }
}
