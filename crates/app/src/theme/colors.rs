use gpui::{rgb, Hsla};

/// Theme colors based on shadcn-ui design system
#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Theme {
    // Base colors
    pub background: Hsla,
    pub foreground: Hsla,
    
    // Card colors
    pub card: Hsla,
    pub card_foreground: Hsla,
    
    // Popover colors
    pub popover: Hsla,
    pub popover_foreground: Hsla,
    
    // Primary colors
    pub primary: Hsla,
    pub primary_foreground: Hsla,
    
    // Secondary colors
    pub secondary: Hsla,
    pub secondary_foreground: Hsla,
    
    // Muted colors
    pub muted: Hsla,
    pub muted_foreground: Hsla,
    
    // Accent colors
    pub accent: Hsla,
    pub accent_foreground: Hsla,
    
    // Destructive colors
    pub destructive: Hsla,
    pub destructive_foreground: Hsla,
    
    // Border and input
    pub border: Hsla,
    pub input: Hsla,
    pub ring: Hsla,
    
    // Sidebar colors
    pub sidebar: Hsla,
    pub sidebar_foreground: Hsla,
    pub sidebar_primary: Hsla,
    pub sidebar_primary_foreground: Hsla,
    pub sidebar_accent: Hsla,
    pub sidebar_accent_foreground: Hsla,
    pub sidebar_border: Hsla,
    pub sidebar_ring: Hsla,
}

impl Theme {
    /// Light theme colors
    pub fn light() -> Self {
        Self {
            background: rgb(0xFCFCFC).into(),
            foreground: rgb(0x000000).into(),
            card: rgb(0xFFFFFF).into(),
            card_foreground: rgb(0x000000).into(),
            popover: rgb(0xFCFCFC).into(),
            popover_foreground: rgb(0x000000).into(),
            primary: rgb(0x000000).into(),
            primary_foreground: rgb(0xFFFFFF).into(),
            secondary: rgb(0xEBEBEB).into(),
            secondary_foreground: rgb(0x000000).into(),
            muted: rgb(0xF5F5F5).into(),
            muted_foreground: rgb(0x525252).into(),
            accent: rgb(0xEBEBEB).into(),
            accent_foreground: rgb(0x000000).into(),
            destructive: rgb(0xE54B4F).into(),
            destructive_foreground: rgb(0xFFFFFF).into(),
            border: rgb(0xE4E4E4).into(),
            input: rgb(0xEBEBEB).into(),
            ring: rgb(0x000000).into(),
            sidebar: rgb(0xFCFCFC).into(),
            sidebar_foreground: rgb(0x000000).into(),
            sidebar_primary: rgb(0x000000).into(),
            sidebar_primary_foreground: rgb(0xFFFFFF).into(),
            sidebar_accent: rgb(0xEBEBEB).into(),
            sidebar_accent_foreground: rgb(0x000000).into(),
            sidebar_border: rgb(0xEBEBEB).into(),
            sidebar_ring: rgb(0x000000).into(),
        }
    }

    /// Dark theme colors (default)
    pub fn dark() -> Self {
        Self {
            background: rgb(0x000000).into(),
            foreground: rgb(0xFFFFFF).into(),
            card: rgb(0x090909).into(),
            card_foreground: rgb(0xFFFFFF).into(),
            popover: rgb(0x121212).into(),
            popover_foreground: rgb(0xFFFFFF).into(),
            primary: rgb(0xFFFFFF).into(),
            primary_foreground: rgb(0x000000).into(),
            secondary: rgb(0x222222).into(),
            secondary_foreground: rgb(0xFFFFFF).into(),
            muted: rgb(0x1D1D1D).into(),
            muted_foreground: rgb(0xA4A4A4).into(),
            accent: rgb(0x333333).into(),
            accent_foreground: rgb(0xFFFFFF).into(),
            destructive: rgb(0xFF5B5B).into(),
            destructive_foreground: rgb(0x000000).into(),
            border: rgb(0x242424).into(),
            input: rgb(0x333333).into(),
            ring: rgb(0xA4A4A4).into(),
            sidebar: rgb(0x121212).into(),
            sidebar_foreground: rgb(0xFFFFFF).into(),
            sidebar_primary: rgb(0xFFFFFF).into(),
            sidebar_primary_foreground: rgb(0x000000).into(),
            sidebar_accent: rgb(0x333333).into(),
            sidebar_accent_foreground: rgb(0xFFFFFF).into(),
            sidebar_border: rgb(0x333333).into(),
            sidebar_ring: rgb(0xA4A4A4).into(),
        }
    }
}
