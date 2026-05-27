import { KeyboardEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CompleteProfilePayload, WorkExperienceItem } from "@/types/auth";
import { profileService } from "@/features/profile/services/profile.service";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });
}

export function useCompleteProfileMutation() {
  return useMutation({
    mutationFn: ({ fullName, birthDate, keySkills, workExperience }: CompleteProfilePayload) =>
      profileService.updateProfile({ fullName, birthDate, keySkills, workExperience }),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useWorkExperienceInput() {
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [yearsInput, setYearsInput] = useState("");
  const [warnedExperience, setWarnedExperience] = useState(false);

  function onJobTitleChange(value: string) {
    setJobTitleInput(value);
    setWarnedExperience(false);
  }

  function onYearsChange(value: string) {
    setYearsInput(value);
    setWarnedExperience(false);
  }

  function resetInputs() {
    setJobTitleInput("");
    setYearsInput("");
    setWarnedExperience(false);
  }

  function getValidatedExperience(): Omit<WorkExperienceItem, "id"> | null {
    const title = jobTitleInput.trim();
    const years = Number(yearsInput);
    if (!title || Number.isNaN(years) || years < 0) return null;
    return { title, years };
  }

  function checkUnsaved(): boolean {
    const hasUnsaved = jobTitleInput.trim() !== "" || yearsInput.trim() !== "";
    if (!hasUnsaved) return false;
    if (!warnedExperience) {
      setWarnedExperience(true);
      return true;
    }
    resetInputs();
    return false;
  }

  return { jobTitleInput, onJobTitleChange, yearsInput, onYearsChange, warnedExperience, resetInputs, checkUnsaved, getValidatedExperience };
}

export function useSkillInput(onAdd: (skill: string) => void, existingSkills?: string[]) {
  const [skillInput, setSkillInput] = useState("");
  const [warnedSkill, setWarnedSkill] = useState(false);

  function onSkillInputChange(value: string) {
    setSkillInput(value);
    setWarnedSkill(false);
  }

  function handleSkillKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = skillInput.trim();
    if (!value || existingSkills?.includes(value)) return;
    onAdd(value);
    setSkillInput("");
    setWarnedSkill(false);
  }

  function checkUnsavedSkill(): boolean {
    if (!skillInput.trim()) return false;
    if (!warnedSkill) {
      setWarnedSkill(true);
      return true;
    }
    setSkillInput("");
    setWarnedSkill(false);
    return false;
  }

  return { skillInput, setSkillInput, onSkillInputChange, handleSkillKeyDown, warnedSkill, checkUnsavedSkill };
}
