import profileData from "@/mocks/profile.json";
import { mockDelay } from "@/services/mock-delay";
import { UpdateUserProfilePayload, UserProfile } from "@/types/profile";
import { ProfileGateway } from "./profile.gateway";

let profile: UserProfile = {
  ...(profileData as UserProfile),
  keySkills: [...(profileData as UserProfile).keySkills],
  workExperience: [...(profileData as UserProfile).workExperience],
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
