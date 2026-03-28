import verificationData from "@/mocks/auth/verification.json";
import { mockDelay } from "@/services/mock-delay";
import { AuthUser, CompleteProfilePayload, LoginPayload, PasswordPayload, RegistrationEmailPayload, VerificationPayload } from "@/types/auth";
import { AuthGateway } from "./auth.gateway";

const defaultMockUser: AuthUser = {
  id: "u_2",
  fullName: "Sarah Connor",
  email: "sarah.connor@example.com",
};

export const authMockGateway: AuthGateway = {
  async login(payload: LoginPayload) {
    await mockDelay(220);

    if (!payload.email.includes("@") || payload.password.length < 6) {
      throw new Error("Invalid email or password");
    }

    return { ...defaultMockUser, email: payload.email };
  },
  async loginWithGoogle() {
    await mockDelay(220);
    return defaultMockUser;
  },
  async startRegistration(payload: RegistrationEmailPayload) {
    await mockDelay(180);
    if (!payload.email.includes("@")) {
      throw new Error("Please enter a valid email");
    }

    return { email: payload.email, verificationSent: true };
  },
  async verifyEmail(payload: VerificationPayload) {
    await mockDelay(180);
    if (payload.code !== verificationData.defaultCode) {
      throw new Error("Invalid verification code");
    }
    return { verified: true };
  },
  async setPassword(payload: PasswordPayload) {
    await mockDelay(180);
    if (payload.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    return { passwordSet: true };
  },
  async completeProfile(payload: CompleteProfilePayload) {
    await mockDelay(220);
    return {
      id: "u_3",
      fullName: payload.fullName,
      email: payload.email,
    };
  },
};
