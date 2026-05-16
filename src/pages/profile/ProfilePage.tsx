import { FormEvent, useState } from "react";
import { BriefcaseBusiness, PenLine, Plus, UserRound, X } from "lucide-react";
import { useProfileQuery, useSkillInput, useUpdateProfileMutation, useWorkExperienceInput } from "@/features/profile/hooks";
import { BirthDateInput } from "@/features/profile/components/BirthDateInput";
import { WorkExperienceInputRow } from "@/features/profile/components/WorkExperienceInputRow";
import { WorkExperienceList } from "@/features/profile/components/WorkExperienceList";
import { WorkExperienceItem } from "@/types/auth";
import { UserProfile } from "@/types/profile";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

function cloneProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    keySkills: [...profile.keySkills],
    workExperience: profile.workExperience.map((item) => ({ ...item })),
  };
}

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const [skillsDraft, setSkillsDraft] = useState<string[]>([]);

  const { jobTitleInput, onJobTitleChange, yearsInput, onYearsChange, warnedExperience, resetInputs, checkUnsaved, getValidatedExperience } =
    useWorkExperienceInput();

  const { skillInput, setSkillInput, handleSkillKeyDown } = useSkillInput(
    (skill) => setSkillsDraft((prev) => [...prev, skill]),
    skillsDraft,
  );

  const displayedProfile = isEditing ? draft : profile;

  function beginEditing() {
    if (!profile) return;
    const nextDraft = cloneProfile(profile);
    setDraft(nextDraft);
    setSkillsDraft([...nextDraft.keySkills]);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(null);
    setIsSkillsModalOpen(false);
    setSkillInput("");
    resetInputs();
    setIsEditing(false);
  }

  async function handleSaveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    if (checkUnsaved()) return;

    await updateProfileMutation.mutateAsync({
      fullName: draft.fullName,
      birthDate: draft.birthDate,
      keySkills: draft.keySkills,
      workExperience: draft.workExperience,
    });

    setDraft(null);
    setIsEditing(false);
  }

  function addWorkExperience() {
    const experience = getValidatedExperience();
    if (!experience || !draft) return;

    const newItem: WorkExperienceItem = { id: crypto.randomUUID(), ...experience };
    setDraft((prev) => (prev ? { ...prev, workExperience: [...prev.workExperience, newItem] } : prev));
    resetInputs();
  }

  function removeWorkExperience(id: string) {
    setDraft((prev) => (prev ? { ...prev, workExperience: prev.workExperience.filter((item) => item.id !== id) } : prev));
  }

  function openSkillsModal() {
    if (!draft || !isEditing) return;
    setSkillsDraft([...draft.keySkills]);
    setSkillInput("");
    setIsSkillsModalOpen(true);
  }

  function removeSkill(skill: string) {
    if (!isEditing) return;
    setSkillsDraft((prev) => prev.filter((item) => item !== skill));
    setDraft((prev) => (prev ? { ...prev, keySkills: prev.keySkills.filter((item) => item !== skill) } : prev));
  }

  function saveSkills() {
    const pendingSkill = skillInput.trim();
    const finalSkills = pendingSkill && !skillsDraft.includes(pendingSkill) ? [...skillsDraft, pendingSkill] : skillsDraft;
    setSkillsDraft(finalSkills);
    setSkillInput("");
    setDraft((prev) => (prev ? { ...prev, keySkills: finalSkills } : prev));
    setIsSkillsModalOpen(false);
  }

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading profile...</p>;
  }

  if (isError || !displayedProfile) {
    return <p className="text-sm text-red-500">Failed to load profile.</p>;
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-[1120px]">
      <Card className="overflow-hidden shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#1F1B4D] text-5xl font-semibold text-white">
              {displayedProfile.avatarInitials}
            </div>

            <div className="space-y-3">
              <div>
                <h1 className="text-5xl font-semibold text-text-primary">{displayedProfile.fullName}</h1>
                <p className="mt-1 text-2xl text-text-secondary">{displayedProfile.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(isEditing ? skillsDraft : displayedProfile.keySkills).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-success/35 bg-success/20 px-3 text-sm font-medium text-success"
                  >
                    {skill}
                    {isEditing && (
                      <button type="button" onClick={() => removeSkill(skill)} className="grid h-4 w-4 place-items-center">
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}

                {isEditing && (
                  <button
                    type="button"
                    onClick={openSkillsModal}
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-text-secondary"
                    aria-label="Edit skills"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <Button className="h-12 w-[146px] whitespace-nowrap text-base" onClick={beginEditing} disabled={isEditing} variant="primary">
            <PenLine size={14} />
            Edit Profile
          </Button>
        </div>

        <form className="space-y-8 px-8 py-8" onSubmit={handleSaveChanges}>
          <div className="mx-auto grid max-w-[924px] gap-10 lg:grid-cols-[1fr_1px_1fr]">
            <section className="space-y-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-success">
                  <UserRound size={18} />
                </span>
                <h2 className="text-2xl font-semibold text-text-primary">Personal Information</h2>
              </div>

              <Input
                id="profile-fullName"
                label="Full Name"
                value={displayedProfile.fullName}
                onChange={(event) => {
                  if (!isEditing) return;
                  setDraft((prev) => (prev ? { ...prev, fullName: event.target.value } : prev));
                }}
                disabled={!isEditing}
              />

              <Input id="profile-email" label="Email" value={displayedProfile.email} disabled />

              <BirthDateInput
                id="profile-birthDate"
                value={displayedProfile.birthDate}
                onChange={(value) => setDraft((prev) => (prev ? { ...prev, birthDate: value } : prev))}
                disabled={!isEditing}
              />
            </section>

            <div className="hidden w-px bg-border lg:block" />

            <section className="space-y-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-success">
                  <BriefcaseBusiness size={18} />
                </span>
                <h2 className="text-2xl font-semibold text-text-primary">Work Experience</h2>
              </div>

              <WorkExperienceList items={displayedProfile.workExperience} onRemove={isEditing ? removeWorkExperience : undefined} />

              {isEditing && (
                <WorkExperienceInputRow
                  idPrefix="profile-"
                  jobTitleInput={jobTitleInput}
                  onJobTitleChange={onJobTitleChange}
                  yearsInput={yearsInput}
                  onYearsChange={onYearsChange}
                  onAdd={addWorkExperience}
                  warnedExperience={warnedExperience}
                />
              )}
            </section>
          </div>

          {updateProfileMutation.isError && (
            <p className="text-sm text-red-500">Failed to save profile changes. Please try again.</p>
          )}

          {isEditing && (
            <div className="flex justify-center gap-4 pt-2">
              <Button type="submit" className="h-12 w-[181px] text-base" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                className="h-12 w-[181px] border-0 bg-border text-base text-text-primary shadow-none hover:bg-border"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Card>

      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4">
          <div className="w-full max-w-[448px] rounded-[20px] border border-border bg-surface p-8 shadow-soft">
            <button type="button" onClick={() => setIsSkillsModalOpen(false)} className="mb-4 text-text-primary" aria-label="Close">
              <X size={20} />
            </button>

            <h3 className="text-4xl font-semibold text-text-primary">Key Skills</h3>

            <div className="mt-6 space-y-4">
              <Input
                id="skills-input"
                label="Key Skills"
                placeholder="Type and press Enter"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {skillsDraft.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-success/35 bg-success/20 px-3 text-sm font-medium text-success"
                  >
                    {skill}
                    <X size={12} />
                  </button>
                ))}
              </div>

              <Button type="button" className="mt-8 h-12 w-full text-base" onClick={saveSkills}>
                Save Skills
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
