import { apiClient } from "@/services/http/api-client";
import { LoginPayload, GoogleAuthResponse } from "@/types/auth";
import { AuthGateway } from "./auth.gateway";

export const authApiGateway: AuthGateway = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<{ accessToken: string }>("/auth/login", payload);
    return data;
  },

  async register(payload: LoginPayload) {
    const { data } = await apiClient.post<{ accessToken: string }>("/auth/register", payload);
    return data;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async googleLogin(token: string, mode: 'register' | 'login') {
    const { data } = await apiClient.post<GoogleAuthResponse>('/auth/google', { token, mode });
    return data;
  },
};
