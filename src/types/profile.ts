import { WorkExperienceItem } from "@/types/auth";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  avatarInitials: string;
  keySkills: string[];
  workExperience: WorkExperienceItem[];
}

export interface UpdateUserProfilePayload {
  fullName: string;
  birthDate: string;
  keySkills: string[];
  workExperience: WorkExperienceItem[];
}
