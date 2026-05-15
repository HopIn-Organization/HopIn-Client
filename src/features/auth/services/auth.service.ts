import { env } from "@/utils/env";
import { authApiGateway } from "./auth.api";
import { authMockGateway } from "./auth.mock";

const gateway = env.dataSource === "api" ? authApiGateway : authMockGateway;

export const authService = {
  login: (payload: Parameters<typeof gateway.login>[0]) => gateway.login(payload),
  logout: () => gateway.logout(),
};
