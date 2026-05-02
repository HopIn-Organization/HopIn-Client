import { create } from "zustand";

interface UiState {
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
  generatingOnboardingId: number | null;
  setGeneratingOnboardingId: (id: number | null) => void;
  generatingForUserId: number | null;
  setGeneratingForUserId: (userId: number | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedProjectId: "p_1",
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  generatingOnboardingId: null,
  setGeneratingOnboardingId: (id) => set({ generatingOnboardingId: id }),
  generatingForUserId: null,
  setGeneratingForUserId: (userId) => set({ generatingForUserId: userId }),
}));
