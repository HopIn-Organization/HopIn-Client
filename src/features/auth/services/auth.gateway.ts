import { LoginPayload, GoogleAuthResponse } from "@/types/auth";

export interface AuthGateway {
  login(payload: LoginPayload): Promise<{ accessToken: string }>;
  register(payload: LoginPayload): Promise<{ accessToken: string }>;
  logout(): Promise<void>;
  googleLogin(token: string, mode: 'register' | 'login'): Promise<GoogleAuthResponse>;
}
