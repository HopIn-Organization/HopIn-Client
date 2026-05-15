import { LoginPayload } from "@/types/auth";

export interface AuthGateway {
  login(payload: LoginPayload): Promise<{ accessToken: string }>;
  logout(): Promise<void>;
}
