import { mockDelay } from "@/services/mock-delay";
import { LoginPayload } from "@/types/auth";
import { AuthGateway } from "./auth.gateway";

export const authMockGateway: AuthGateway = {
  async login(payload: LoginPayload) {
    await mockDelay(220);

    if (!payload.email.includes("@") || payload.password.length < 6) {
      throw new Error("Invalid email or password");
    }

    return { accessToken: "mock-access-token-xyz" };
  },

  async register(payload: LoginPayload) {
    await mockDelay(220);

    if (!payload.email.includes("@") || payload.password.length < 6) {
      throw new Error("Invalid email or password");
    }

    return { accessToken: "mock-access-token-xyz" };
  },

  async logout() {
    await mockDelay(100);
  },

  async googleLogin(token: string, mode: 'register' | 'login') {
    void token;
    void mode;
    await mockDelay(220);
    return {
      accessToken: 'mock-google-access-token',
      user: { email: 'google@example.com', name: 'Google User' },
    };
  },
};
