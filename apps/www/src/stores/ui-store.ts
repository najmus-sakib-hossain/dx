import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;
  isCommandMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        isMobileMenuOpen: false,
        isSidebarCollapsed: false,
        isCommandMenuOpen: false,
        setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
        setSidebarCollapsed: (collapsed) =>
          set({ isSidebarCollapsed: collapsed }),
        setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
        toggleSidebar: () =>
          set((state) => ({
            isSidebarCollapsed: !state.isSidebarCollapsed,
          })),
      }),
      { name: "dx-ui" }
    ),
    { name: "dx-ui-store" }
  )
);
