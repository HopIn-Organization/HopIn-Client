import { create } from "zustand";
import { AuthUser } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  signIn: (user?: AuthUser) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUserEmail: "google-user@example.com",
  signIn: (user) =>
    set((state) => ({
      isAuthenticated: true,
      currentUserEmail: user?.email ?? state.currentUserEmail,
    })),
  signOut: () => set({ isAuthenticated: false, currentUserEmail: null }),
}));
