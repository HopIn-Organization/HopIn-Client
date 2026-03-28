import { AuthUser, CompleteProfilePayload, LoginPayload, PasswordPayload, RegistrationEmailPayload, VerificationPayload } from "@/types/auth";

export interface AuthGateway {
  login(payload: LoginPayload): Promise<AuthUser>;
  loginWithGoogle(): Promise<AuthUser>;
  startRegistration(payload: RegistrationEmailPayload): Promise<{ email: string; verificationSent: true }>;
  verifyEmail(payload: VerificationPayload): Promise<{ verified: true }>;
  setPassword(payload: PasswordPayload): Promise<{ passwordSet: true }>;
  completeProfile(payload: CompleteProfilePayload): Promise<AuthUser>;
}
