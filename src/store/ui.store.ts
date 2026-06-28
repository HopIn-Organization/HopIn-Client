import { create } from "zustand";

interface UiState {
  selectedProjectId: number | null;
  setSelectedProjectId: (projectId: number | null) => void;
  generatingOnboardingId: number | null;
  setGeneratingOnboardingId: (id: number | null) => void;
  generatingForUserId: number | null;
  setGeneratingForUserId: (userId: number | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  generatingOnboardingId: null,
  setGeneratingOnboardingId: (id) => set({ generatingOnboardingId: id }),
  generatingForUserId: null,
  setGeneratingForUserId: (userId) => set({ generatingForUserId: userId }),
}));
