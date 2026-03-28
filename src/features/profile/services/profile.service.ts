import { env } from "@/utils/env";
import { profileApiGateway } from "./profile.api";
import { profileMockGateway } from "./profile.mock";

const gateway = env.dataSource === "api" ? profileApiGateway : profileMockGateway;

export const profileService = {
  getProfile: () => gateway.getProfile(),
  updateProfile: (payload: Parameters<typeof gateway.updateProfile>[0]) => gateway.updateProfile(payload),
};
