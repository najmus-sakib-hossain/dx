import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DockState {
  isExpanded: boolean;
  isVisible: boolean;
  activeToolId: string | null;
  toggleDock: () => void;
  setIsVisible: (visible: boolean) => void;
  setActiveTool: (id: string | null) => void;
}

export const useDockStore = create<DockState>()(
  devtools(
    persist(
      (set) => ({
        isExpanded: true,
        isVisible: true,
        activeToolId: null,
        toggleDock: () => set((state) => ({ isExpanded: !state.isExpanded })),
        setIsVisible: (visible) => set({ isVisible: visible }),
        setActiveTool: (id) => set({ activeToolId: id }),
      }),
      { name: "dx-dock-storage" },
    ),
  ),
);
