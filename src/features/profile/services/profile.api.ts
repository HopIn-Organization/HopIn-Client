import { apiClient } from "@/services/http/api-client";
import { UpdateUserProfilePayload, UserProfile } from "@/types/profile";
import { ProfileGateway } from "./profile.gateway";

export const profileApiGateway: ProfileGateway = {
  async getProfile() {
    const { data } = await apiClient.get<UserProfile>("/profile/me");
    return data;
  },
  async updateProfile(payload: UpdateUserProfilePayload) {
    const { data } = await apiClient.put<UserProfile>("/profile/me", payload);
    return data;
  },
};
