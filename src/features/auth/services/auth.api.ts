import { apiClient } from "@/services/http/api-client";
import { AuthUser, CompleteProfilePayload, LoginPayload, PasswordPayload, RegistrationEmailPayload, VerificationPayload } from "@/types/auth";
import { AuthGateway } from "./auth.gateway";

export const authApiGateway: AuthGateway = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthUser>("/auth/login", payload);
    return data;
  },
  async loginWithGoogle() {
    const { data } = await apiClient.post<AuthUser>("/auth/google");
    return data;
  },
  async startRegistration(payload: RegistrationEmailPayload) {
    const { data } = await apiClient.post<{ email: string; verificationSent: true }>("/auth/register/email", payload);
    return data;
  },
  async verifyEmail(payload: VerificationPayload) {
    const { data } = await apiClient.post<{ verified: true }>("/auth/register/verify", payload);
    return data;
  },
  async setPassword(payload: PasswordPayload) {
    const { data } = await apiClient.post<{ passwordSet: true }>("/auth/register/password", payload);
    return data;
  },
  async completeProfile(payload: CompleteProfilePayload) {
    const { data } = await apiClient.post<AuthUser>("/auth/register/profile", payload);
    return data;
  },
};
