// ─── UI Component Library ───────────────────────────────────────────────────
// Shadcn-ui style reusable components built with GPUI.
// Each module maps to a shadcn-ui component category.

pub mod alert;
pub mod layout;
pub mod misc;
pub mod popover;
pub mod progress;
pub mod select;
pub mod sheet;
pub mod switch;
pub mod table;
pub mod tabs;

// ── Re-exports for ergonomic imports ──

// Alert & Feedback
pub use alert::{Alert, AlertDialog, AlertVariant, Dialog, Toast, ToastVariant};

// Layout
pub use layout::{
    AspectRatio, Center, Container, HStack, ResizableDirection, ResizablePanel, Spacer, StackAlign,
    VStack,
};

// Misc / Navigation
pub use misc::{Breadcrumb, EmptyState, HoverCard, Pagination, Stat, StatTrend};

// Popover / Menu / Command
pub use popover::{
    CommandItem, CommandPalette, ContextMenu, ContextMenuItem, DropdownMenu, DropdownMenuItem,
    Popover, Tooltip, TooltipSide,
};

// Progress & Skeleton
pub use progress::{Progress, ProgressSize, Skeleton};

// Select
pub use select::{Select, SelectOption};

// Sheet & Scroll
pub use sheet::{Collapsible, ScrollArea, Sheet, SheetSide};

// Switch / Checkbox / Radio
pub use switch::{Checkbox, RadioGroup, RadioOrientation, Switch};

// Table & Data
pub use table::{DataTable, List, Table};

// Tabs & Accordion
pub use tabs::{Accordion, TabOrientation, Tabs};
