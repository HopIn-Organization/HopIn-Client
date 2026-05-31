import profileData from "@/mocks/profile.json";
import { mockDelay } from "@/services/mock-delay";
import { UpdateUserProfilePayload, UserProfile } from "@/types/profile";
import { ProfileGateway } from "./profile.gateway";

const rawProfile = profileData as Record<string, unknown>;
let profile: UserProfile = {
  id: typeof rawProfile.id === "number" ? rawProfile.id : 1,
  fullName: String(rawProfile.fullName ?? ""),
  email: String(rawProfile.email ?? ""),
  birthDate: String(rawProfile.birthDate ?? ""),
  avatarInitials: String(rawProfile.avatarInitials ?? ""),
  keySkills: Array.isArray(rawProfile.keySkills) ? (rawProfile.keySkills as string[]) : [],
  workExperience: Array.isArray(rawProfile.workExperience)
    ? (rawProfile.workExperience as UserProfile["workExperience"])
    : [],
};

export const profileMockGateway: ProfileGateway = {
  async getProfile() {
    await mockDelay(180);
    return {
      ...profile,
      keySkills: [...profile.keySkills],
      workExperience: [...profile.workExperience],
    };
  },
  async updateProfile(payload: UpdateUserProfilePayload) {
    await mockDelay(180);

    profile = {
      ...profile,
      fullName: payload.fullName,
      birthDate: payload.birthDate,
      keySkills: [...payload.keySkills],
      workExperience: [...payload.workExperience],
    };

    return {
      ...profile,
      keySkills: [...profile.keySkills],
      workExperience: [...profile.workExperience],
    };
  },
};
