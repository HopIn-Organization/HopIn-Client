import { create } from "zustand";
import { WorkExperienceItem } from "@/types/auth";

interface RegistrationState {
  email: string;
  isEmailVerified: boolean;
  password: string;
  fullName: string;
  birthDate: string;
  keySkills: string[];
  workExperience: WorkExperienceItem[];
  setEmail: (email: string) => void;
  setEmailVerified: (isVerified: boolean) => void;
  setPassword: (password: string) => void;
  setProfileField: (field: "fullName" | "birthDate", value: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addExperience: (payload: Omit<WorkExperienceItem, "id">) => void;
  removeExperience: (id: string) => void;
  reset: () => void;
}

const initialState = {
  email: "",
  isEmailVerified: false,
  password: "",
  fullName: "",
  birthDate: "",
  keySkills: [] as string[],
  workExperience: [] as WorkExperienceItem[],
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  setEmail: (email) => set({ email }),
  setEmailVerified: (isEmailVerified) => set({ isEmailVerified }),
  setPassword: (password) => set({ password }),
  setProfileField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  addSkill: (skill) =>
    set((state) => ({
      keySkills: state.keySkills.includes(skill) ? state.keySkills : [...state.keySkills, skill],
    })),
  removeSkill: (skill) =>
    set((state) => ({
      keySkills: state.keySkills.filter((item) => item !== skill),
    })),
  addExperience: (payload) =>
    set((state) => ({
      workExperience: [...state.workExperience, { id: crypto.randomUUID(), ...payload }],
    })),
  removeExperience: (id) =>
    set((state) => ({
      workExperience: state.workExperience.filter((item) => item.id !== id),
    })),
  reset: () => set(initialState),
}));
