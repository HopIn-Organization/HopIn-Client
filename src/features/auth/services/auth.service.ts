import { env } from "@/utils/env";
import { authApiGateway } from "./auth.api";
import { authMockGateway } from "./auth.mock";

const gateway = env.dataSource === "api" ? authApiGateway : authMockGateway;

export const authService = {
  login: (payload: Parameters<typeof gateway.login>[0]) => gateway.login(payload),
  register: (payload: Parameters<typeof gateway.register>[0]) => gateway.register(payload),
  logout: () => gateway.logout(),
  googleLogin: (token: string, mode: 'register' | 'login') => gateway.googleLogin(token, mode),
};
