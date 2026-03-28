import { UpdateUserProfilePayload, UserProfile } from "@/types/profile";

export interface ProfileGateway {
  getProfile(): Promise<UserProfile>;
  updateProfile(payload: UpdateUserProfilePayload): Promise<UserProfile>;
}
