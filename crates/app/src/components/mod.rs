// ─── DX Component Library ───────────────────────────────────────────────────
// Shadcn-ui inspired component library built with GPUI (Zed's GPU-accelerated
// UI framework). All components follow shadcn-ui patterns: composable, themed,
// and highly customizable via builder methods.
//
// Architecture:
//   - Top-level components: standalone UI primitives (Button, Card, etc.)
//   - ui/ module: rich interactive components (Dialog, Tabs, Table, etc.)
//   - All components accept &Theme for consistent theming

// ── Core components ──
pub mod avatar;
pub mod badge;
pub mod button;
pub mod card;
pub mod icon_grid;
pub mod input;
pub mod label;
pub mod search_bar;
pub mod separator;
pub mod sidebar;
pub mod titlebar;

// ── Extended component library (ui/) ──
pub mod ui;

// ── Re-exports for ergonomic usage ──
//
// Usage:
//   use crate::components::{Button, Card, Badge, ...};
//   use crate::components::ui::{Dialog, Tabs, Table, ...};

// Core primitives
pub use avatar::{Avatar, AvatarGroup, AvatarSize};
pub use badge::{Badge, BadgeVariant};
pub use button::{Button, ButtonGroup, ButtonSize, ButtonVariant, IconButton};
pub use card::{Card, CardHeader};
pub use input::{Input, InputArea, Textarea};
pub use label::{Kbd, Label};
pub use separator::Separator;
pub use sidebar::{Sidebar, SidebarItem, SidebarSection, SidebarThread};
pub use titlebar::TitleBar;
