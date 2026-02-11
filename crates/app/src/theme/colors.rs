use gpui::{rgb, Hsla, Pixels, px};

// ─── Design Token Constants ─────────────────────────────────────────────────

/// Spacing scale following shadcn-ui / Tailwind conventions.
#[derive(Debug, Clone, Copy)]
pub struct Spacing;

#[allow(dead_code)]
impl Spacing {
    pub const NONE: Pixels = px(0.0);
    pub const PX: Pixels = px(1.0);
    pub const HALF: Pixels = px(2.0);
    pub const ONE: Pixels = px(4.0);
    pub const ONE_HALF: Pixels = px(6.0);
    pub const TWO: Pixels = px(8.0);
    pub const TWO_HALF: Pixels = px(10.0);
    pub const THREE: Pixels = px(12.0);
    pub const THREE_HALF: Pixels = px(14.0);
    pub const FOUR: Pixels = px(16.0);
    pub const FIVE: Pixels = px(20.0);
    pub const SIX: Pixels = px(24.0);
    pub const EIGHT: Pixels = px(32.0);
    pub const TEN: Pixels = px(40.0);
    pub const TWELVE: Pixels = px(48.0);
    pub const SIXTEEN: Pixels = px(64.0);
    pub const TWENTY: Pixels = px(80.0);
    pub const TWENTY_FOUR: Pixels = px(96.0);
}

/// Radius scale matching shadcn-ui
#[derive(Debug, Clone, Copy)]
pub struct Radius;

#[allow(dead_code)]
impl Radius {
    pub const NONE: Pixels = px(0.0);
    pub const SM: Pixels = px(4.0);
    pub const DEFAULT: Pixels = px(6.0);
    pub const MD: Pixels = px(8.0);
    pub const LG: Pixels = px(12.0);
    pub const XL: Pixels = px(16.0);
    pub const XXL: Pixels = px(24.0);
    pub const FULL: Pixels = px(9999.0);
}

// ─── Theme Struct ───────────────────────────────────────────────────────────

/// Complete shadcn-ui compatible theme with extended design tokens.
/// All colors use HSLA for proper alpha compositing on the GPU.
#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Theme {
    // ── Core semantic colors ──
    pub background: Hsla,
    pub foreground: Hsla,
    pub card: Hsla,
    pub card_foreground: Hsla,
    pub popover: Hsla,
    pub popover_foreground: Hsla,
    pub primary: Hsla,
    pub primary_foreground: Hsla,
    pub secondary: Hsla,
    pub secondary_foreground: Hsla,
    pub muted: Hsla,
    pub muted_foreground: Hsla,
    pub accent: Hsla,
    pub accent_foreground: Hsla,
    pub destructive: Hsla,
    pub destructive_foreground: Hsla,
    pub border: Hsla,
    pub input: Hsla,
    pub ring: Hsla,

    // ── Extended semantic colors ──
    pub success: Hsla,
    pub success_foreground: Hsla,
    pub warning: Hsla,
    pub warning_foreground: Hsla,
    pub info: Hsla,
    pub info_foreground: Hsla,

    // ── Chart colors ──
    pub chart_1: Hsla,
    pub chart_2: Hsla,
    pub chart_3: Hsla,
    pub chart_4: Hsla,
    pub chart_5: Hsla,

    // ── Sidebar ──
    pub sidebar: Hsla,
    pub sidebar_foreground: Hsla,
    pub sidebar_primary: Hsla,
    pub sidebar_primary_foreground: Hsla,
    pub sidebar_accent: Hsla,
    pub sidebar_accent_foreground: Hsla,
    pub sidebar_border: Hsla,
    pub sidebar_ring: Hsla,

    // ── Overlay / transparent ──
    pub overlay: Hsla,
    pub ghost_hover: Hsla,
}

impl Theme {
    /// Light theme (shadcn-ui default light)
    pub fn light() -> Self {
        Self {
            background: rgb(0xFCFCFC).into(),
            foreground: rgb(0x0A0A0A).into(),
            card: rgb(0xFFFFFF).into(),
            card_foreground: rgb(0x0A0A0A).into(),
            popover: rgb(0xFFFFFF).into(),
            popover_foreground: rgb(0x0A0A0A).into(),
            primary: rgb(0x171717).into(),
            primary_foreground: rgb(0xFAFAFA).into(),
            secondary: rgb(0xF5F5F5).into(),
            secondary_foreground: rgb(0x171717).into(),
            muted: rgb(0xF5F5F5).into(),
            muted_foreground: rgb(0x737373).into(),
            accent: rgb(0xF5F5F5).into(),
            accent_foreground: rgb(0x171717).into(),
            destructive: rgb(0xEF4444).into(),
            destructive_foreground: rgb(0xFAFAFA).into(),
            border: rgb(0xE5E5E5).into(),
            input: rgb(0xE5E5E5).into(),
            ring: rgb(0x171717).into(),

            success: rgb(0x22C55E).into(),
            success_foreground: rgb(0xFFFFFF).into(),
            warning: rgb(0xF59E0B).into(),
            warning_foreground: rgb(0x000000).into(),
            info: rgb(0x3B82F6).into(),
            info_foreground: rgb(0xFFFFFF).into(),

            chart_1: rgb(0xE76E50).into(),
            chart_2: rgb(0x2A9D90).into(),
            chart_3: rgb(0x274754).into(),
            chart_4: rgb(0xE9C46B).into(),
            chart_5: rgb(0xF4A462).into(),

            sidebar: rgb(0xFAFAFA).into(),
            sidebar_foreground: rgb(0x0A0A0A).into(),
            sidebar_primary: rgb(0x171717).into(),
            sidebar_primary_foreground: rgb(0xFAFAFA).into(),
            sidebar_accent: rgb(0xF5F5F5).into(),
            sidebar_accent_foreground: rgb(0x171717).into(),
            sidebar_border: rgb(0xE5E5E5).into(),
            sidebar_ring: rgb(0x171717).into(),

            overlay: Hsla { h: 0.0, s: 0.0, l: 0.0, a: 0.5 },
            ghost_hover: Hsla { h: 0.0, s: 0.0, l: 0.96, a: 1.0 },
        }
    }

    /// Dark theme (shadcn-ui default dark)
    pub fn dark() -> Self {
        Self {
            background: rgb(0x09090B).into(),
            foreground: rgb(0xFAFAFA).into(),
            card: rgb(0x09090B).into(),
            card_foreground: rgb(0xFAFAFA).into(),
            popover: rgb(0x09090B).into(),
            popover_foreground: rgb(0xFAFAFA).into(),
            primary: rgb(0xFAFAFA).into(),
            primary_foreground: rgb(0x18181B).into(),
            secondary: rgb(0x27272A).into(),
            secondary_foreground: rgb(0xFAFAFA).into(),
            muted: rgb(0x27272A).into(),
            muted_foreground: rgb(0xA1A1AA).into(),
            accent: rgb(0x27272A).into(),
            accent_foreground: rgb(0xFAFAFA).into(),
            destructive: rgb(0xEF4444).into(),
            destructive_foreground: rgb(0xFAFAFA).into(),
            border: rgb(0x27272A).into(),
            input: rgb(0x27272A).into(),
            ring: rgb(0xD4D4D8).into(),

            success: rgb(0x22C55E).into(),
            success_foreground: rgb(0x000000).into(),
            warning: rgb(0xF59E0B).into(),
            warning_foreground: rgb(0x000000).into(),
            info: rgb(0x3B82F6).into(),
            info_foreground: rgb(0xFFFFFF).into(),

            chart_1: rgb(0x2662D9).into(),
            chart_2: rgb(0x2EB88A).into(),
            chart_3: rgb(0xE88C30).into(),
            chart_4: rgb(0xAF57DB).into(),
            chart_5: rgb(0xE23670).into(),

            sidebar: rgb(0x09090B).into(),
            sidebar_foreground: rgb(0xFAFAFA).into(),
            sidebar_primary: rgb(0xFAFAFA).into(),
            sidebar_primary_foreground: rgb(0x18181B).into(),
            sidebar_accent: rgb(0x27272A).into(),
            sidebar_accent_foreground: rgb(0xFAFAFA).into(),
            sidebar_border: rgb(0x27272A).into(),
            sidebar_ring: rgb(0xD4D4D8).into(),

            overlay: Hsla { h: 0.0, s: 0.0, l: 0.0, a: 0.8 },
            ghost_hover: Hsla { h: 0.0, s: 0.0, l: 0.15, a: 1.0 },
        }
    }
}
