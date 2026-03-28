export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationEmailPayload {
  email: string;
}

export interface VerificationPayload {
  email: string;
  code: string;
}

export interface PasswordPayload {
  email: string;
  password: string;
}

export interface WorkExperienceItem {
  id: string;
  title: string;
  years: number;
}

export interface CompleteProfilePayload {
  email: string;
  fullName: string;
  birthDate: string;
  keySkills: string[];
  workExperience: WorkExperienceItem[];
}
