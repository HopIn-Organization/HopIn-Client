import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  setAccessToken: (token: string) => void;
  setCurrentUserEmail: (email: string) => void;
  signIn: (user: { email: string }) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  currentUserEmail: localStorage.getItem("current_user_email"),

  setAccessToken: (token: string) => {
    localStorage.setItem("access_token", token);
    set({ accessToken: token, isAuthenticated: true });
  },

  setCurrentUserEmail: (email: string) => {
    localStorage.setItem("current_user_email", email);
    set({ currentUserEmail: email.toLowerCase() });
  },

  signIn: (user: { email: string }) => {
    localStorage.setItem("current_user_email", user.email.toLowerCase());
    set({ currentUserEmail: user.email.toLowerCase() });
  },

  signOut: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user_email");
    set({ accessToken: null, isAuthenticated: false, currentUserEmail: null });
  },
}));
