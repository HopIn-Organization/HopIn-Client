import { create } from "zustand";

interface UiState {
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedProjectId: "p_1",
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
}));
