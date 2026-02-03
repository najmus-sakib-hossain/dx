//! Multiple selection prompt

use super::interaction::{Event, PromptInteraction, State};
use super::{
    S_BAR, S_BAR_END, S_CHECKBOX_ACTIVE, S_CHECKBOX_INACTIVE, S_CHECKBOX_SELECTED, S_STEP_ACTIVE,
    S_STEP_SUBMIT, THEME,
};
use console::Term;
use owo_colors::OwoColorize;
use std::io;

/// A single item in a multiselect list.
#[derive(Clone)]
pub struct MultiSelectItem<T: Clone> {
    /// The value returned when this item is selected.
    pub value: T,
    /// The label displayed to the user.
    pub label: String,
    /// An optional hint shown next to the label.
    pub hint: Option<String>,
    /// Whether this item is selected.
    pub selected: bool,
}

impl<T: Clone> MultiSelectItem<T> {
    /// Creates a new multiselect item.
    pub fn new(value: T, label: impl Into<String>) -> Self {
        Self {
            value,
            label: label.into(),
            hint: None,
            selected: false,
        }
    }

    /// Adds a hint to the item.
    pub fn hint(mut self, hint: impl Into<String>) -> Self {
        self.hint = Some(hint.into());
        self
    }

    /// Sets the item as initially selected.
    pub fn selected(mut self, selected: bool) -> Self {
        self.selected = selected;
        self
    }
}

/// A multiple-selection prompt with checkboxes.
pub struct MultiSelect<T: Clone> {
    message: String,
    items: Vec<MultiSelectItem<T>>,
    cursor: usize,
    state: State,
    last_render_lines: usize,
    required: bool,
    filter: String,
    filtered_indices: Vec<usize>,
}

impl<T: Clone> MultiSelect<T> {
    /// Creates a new multiselect prompt.
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            items: Vec::new(),
            cursor: 0,
            state: State::Active,
            last_render_lines: 0,
            required: false,
            filter: String::new(),
            filtered_indices: Vec::new(),
        }
    }

    /// Adds an item to the selection list.
    pub fn item(mut self, value: T, label: impl Into<String>, hint: impl Into<String>) -> Self {
        let label = label.into();
        let hint_str = hint.into();
        let item = if hint_str.is_empty() {
            MultiSelectItem::new(value, label)
        } else {
            MultiSelectItem::new(value, label).hint(hint_str)
        };
        self.items.push(item);
        self.filtered_indices.push(self.items.len() - 1);
        self
    }

    /// Adds an initially selected item to the selection list.
    pub fn item_selected(
        mut self,
        value: T,
        label: impl Into<String>,
        hint: impl Into<String>,
        selected: bool,
    ) -> Self {
        let label = label.into();
        let hint_str = hint.into();
        let item = if hint_str.is_empty() {
            MultiSelectItem::new(value, label).selected(selected)
        } else {
            MultiSelectItem::new(value, label).hint(hint_str).selected(selected)
        };
        self.items.push(item);
        self.filtered_indices.push(self.items.len() - 1);
        self
    }

    /// Sets all items at once.
    pub fn items(mut self, items: Vec<MultiSelectItem<T>>) -> Self {
        let count = items.len();
        self.items = items;
        self.filtered_indices = (0..count).collect();
        self
    }

    /// Requires at least one selection.
    pub fn required(mut self, required: bool) -> Self {
        self.required = required;
        self
    }

    /// Sets the initial cursor position.
    pub fn initial_value(mut self, index: usize) -> Self {
        self.cursor = index.min(self.items.len().saturating_sub(1));
        self
    }

    /// Updates the filter and filtered indices.
    fn update_filter(&mut self) {
        if self.filter.is_empty() {
            self.filtered_indices = (0..self.items.len()).collect();
        } else {
            let filter_lower = self.filter.to_lowercase();
            self.filtered_indices = self
                .items
                .iter()
                .enumerate()
                .filter(|(_, item)| item.label.to_lowercase().contains(&filter_lower))
                .map(|(i, _)| i)
                .collect();
        }
        // Ensure cursor is valid
        if !self.filtered_indices.is_empty() && self.cursor >= self.filtered_indices.len() {
            self.cursor = self.filtered_indices.len() - 1;
        }
    }

    /// Gets the current cursor index in the original items list.
    fn current_index(&self) -> Option<usize> {
        self.filtered_indices.get(self.cursor).copied()
    }

    /// Returns the count of selected items.
    fn selected_count(&self) -> usize {
        self.items.iter().filter(|i| i.selected).count()
    }

    /// Toggles selection of the current item.
    fn toggle_current(&mut self) {
        if let Some(idx) = self.current_index() {
            self.items[idx].selected = !self.items[idx].selected;
        }
    }

    /// Selects all items.
    fn select_all(&mut self) {
        for idx in &self.filtered_indices {
            self.items[*idx].selected = true;
        }
    }

    /// Deselects all items.
    fn deselect_all(&mut self) {
        for idx in &self.filtered_indices {
            self.items[*idx].selected = false;
        }
    }
}

impl<T: Clone> PromptInteraction for MultiSelect<T> {
    type Output = Vec<T>;

    fn state(&self) -> State {
        self.state
    }

    fn on(&mut self, event: Event) {
        match event {
            Event::Key(key) => match key {
                console::Key::Enter => {
                    if self.required && self.selected_count() == 0 {
                        // Can't submit with no selection when required
                    } else {
                        self.state = State::Submit;
                    }
                }
                console::Key::Escape => {
                    self.state = State::Cancel;
                }
                console::Key::ArrowUp | console::Key::Char('k') => {
                    if self.cursor > 0 {
                        self.cursor -= 1;
                    }
                }
                console::Key::ArrowDown | console::Key::Char('j') => {
                    if self.cursor + 1 < self.filtered_indices.len() {
                        self.cursor += 1;
                    }
                }
                console::Key::Char(' ') => {
                    self.toggle_current();
                }
                console::Key::Char('a') => {
                    // Toggle all
                    if self.selected_count() == self.filtered_indices.len() {
                        self.deselect_all();
                    } else {
                        self.select_all();
                    }
                }
                console::Key::Home => {
                    self.cursor = 0;
                }
                console::Key::End => {
                    self.cursor = self.filtered_indices.len().saturating_sub(1);
                }
                console::Key::Backspace => {
                    self.filter.pop();
                    self.update_filter();
                }
                console::Key::Char(c) if !c.is_control() && c != ' ' && c != 'a' => {
                    self.filter.push(c);
                    self.update_filter();
                }
                _ => {}
            },
            Event::Error => {
                self.state = State::Error;
            }
        }
    }

    fn render(&mut self, term: &Term) -> io::Result<()> {
        // Clear previous render
        if self.last_render_lines > 0 {
            for _ in 0..self.last_render_lines {
                term.move_cursor_up(1)?;
                term.clear_line()?;
            }
        }

        let theme = THEME.read().unwrap();
        let mut lines = 0;

        match self.state {
            State::Active => {
                // Title line
                let symbol = theme.primary.apply_to(S_STEP_ACTIVE);
                term.write_line(&format!("{} {}", symbol, self.message.bold()))?;
                lines += 1;

                // Filter line (if any)
                let bar = theme.dim.apply_to(S_BAR);
                if !self.filter.is_empty() {
                    term.write_line(&format!(
                        "{}  {}",
                        bar,
                        theme.dim.apply_to(format!("Filter: {}", self.filter))
                    ))?;
                    lines += 1;
                }

                // Items
                let max_visible = 8;
                let start = if self.cursor >= max_visible {
                    self.cursor - max_visible + 1
                } else {
                    0
                };
                let end = (start + max_visible).min(self.filtered_indices.len());

                for display_idx in start..end {
                    let item_idx = self.filtered_indices[display_idx];
                    let item = &self.items[item_idx];
                    let is_cursor = display_idx == self.cursor;

                    let checkbox = if item.selected {
                        if is_cursor {
                            theme.primary.apply_to(S_CHECKBOX_SELECTED).to_string()
                        } else {
                            theme.success.apply_to(S_CHECKBOX_SELECTED).to_string()
                        }
                    } else if is_cursor {
                        theme.primary.apply_to(S_CHECKBOX_ACTIVE).to_string()
                    } else {
                        theme.dim.apply_to(S_CHECKBOX_INACTIVE).to_string()
                    };

                    let label = if is_cursor {
                        theme.primary.apply_to(&item.label).to_string()
                    } else if item.selected {
                        item.label.clone()
                    } else {
                        theme.dim.apply_to(&item.label).to_string()
                    };

                    let hint = item
                        .hint
                        .as_ref()
                        .map(|h| format!(" {}", theme.dim.apply_to(h)))
                        .unwrap_or_default();

                    term.write_line(&format!("{}  {} {}{}", bar, checkbox, label, hint))?;
                    lines += 1;
                }

                // Show scroll indicator if needed
                if self.filtered_indices.len() > max_visible {
                    let remaining = self.filtered_indices.len() - end;
                    if remaining > 0 {
                        term.write_line(&format!(
                            "{}  {}",
                            bar,
                            theme.dim.apply_to(format!("  ... {} more", remaining))
                        ))?;
                        lines += 1;
                    }
                }

                // Hint line
                let selected = self.selected_count();
                let hint_text =
                    format!("↑/↓ navigate • space select • a toggle all • {} selected", selected);
                term.write_line(&format!("{}  {}", bar, theme.dim.apply_to(hint_text)))?;
                lines += 1;

                // Bottom bar
                let bar_end = theme.dim.apply_to(S_BAR_END);
                term.write_line(&format!("{}", bar_end))?;
                lines += 1;
            }
            State::Submit => {
                let symbol = theme.success.apply_to(S_STEP_SUBMIT);
                let selected: Vec<_> =
                    self.items.iter().filter(|i| i.selected).map(|i| i.label.clone()).collect();
                let display = if selected.is_empty() {
                    "none".to_string()
                } else {
                    selected.join(", ")
                };
                term.write_line(&format!(
                    "{} {}  {}",
                    symbol,
                    self.message.bold(),
                    theme.dim.apply_to(display)
                ))?;
                lines += 1;
            }
            State::Cancel => {
                let symbol = theme.error.apply_to(S_STEP_SUBMIT);
                term.write_line(&format!(
                    "{} {}  {}",
                    symbol,
                    self.message.strikethrough(),
                    theme.dim.apply_to("cancelled")
                ))?;
                lines += 1;
            }
            State::Error => {
                let symbol = theme.error.apply_to(S_STEP_SUBMIT);
                term.write_line(&format!(
                    "{} {}  {}",
                    symbol,
                    self.message.bold(),
                    theme.error.apply_to("error")
                ))?;
                lines += 1;
            }
        }

        self.last_render_lines = lines;
        Ok(())
    }

    fn value(&self) -> Vec<T> {
        self.items.iter().filter(|i| i.selected).map(|i| i.value.clone()).collect()
    }
}

/// Creates a new multiselect prompt.
pub fn multiselect<T: Clone>(message: impl Into<String>) -> MultiSelect<T> {
    MultiSelect::new(message)
}
