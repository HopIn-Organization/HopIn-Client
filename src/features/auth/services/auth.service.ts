import { env } from "@/utils/env";
import { authApiGateway } from "./auth.api";
import { authMockGateway } from "./auth.mock";

const gateway = env.dataSource === "api" ? authApiGateway : authMockGateway;

export const authService = {
  login: (payload: Parameters<typeof gateway.login>[0]) => gateway.login(payload),
  loginWithGoogle: () => gateway.loginWithGoogle(),
  startRegistration: (payload: Parameters<typeof gateway.startRegistration>[0]) => gateway.startRegistration(payload),
  verifyEmail: (payload: Parameters<typeof gateway.verifyEmail>[0]) => gateway.verifyEmail(payload),
  setPassword: (payload: Parameters<typeof gateway.setPassword>[0]) => gateway.setPassword(payload),
  completeProfile: (payload: Parameters<typeof gateway.completeProfile>[0]) => gateway.completeProfile(payload),
};
