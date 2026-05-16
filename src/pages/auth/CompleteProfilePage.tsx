import { FormEvent } from "react";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogoMark } from "@/components/brand/LogoMark";
import { BirthDateInput } from "@/features/profile/components/BirthDateInput";
import { WorkExperienceInputRow } from "@/features/profile/components/WorkExperienceInputRow";
import { WorkExperienceList } from "@/features/profile/components/WorkExperienceList";
import { useCompleteProfileMutation, useSkillInput, useWorkExperienceInput } from "@/features/profile/hooks";
import { useAuthStore } from "@/store/auth.store";
import { useRegistrationStore } from "@/store/registration.store";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const email = useRegistrationStore((state) => state.email);
  const fullName = useRegistrationStore((state) => state.fullName);
  const birthDate = useRegistrationStore((state) => state.birthDate);
  const keySkills = useRegistrationStore((state) => state.keySkills);
  const workExperience = useRegistrationStore((state) => state.workExperience);
  const setProfileField = useRegistrationStore((state) => state.setProfileField);
  const addSkill = useRegistrationStore((state) => state.addSkill);
  const removeSkill = useRegistrationStore((state) => state.removeSkill);
  const addExperience = useRegistrationStore((state) => state.addExperience);
  const removeExperience = useRegistrationStore((state) => state.removeExperience);
  const reset = useRegistrationStore((state) => state.reset);
  const completeProfileMutation = useCompleteProfileMutation();

  const { skillInput, onSkillInputChange, handleSkillKeyDown, warnedSkill, checkUnsavedSkill } = useSkillInput(addSkill);
  const { jobTitleInput, onJobTitleChange, yearsInput, onYearsChange, warnedExperience, resetInputs, checkUnsaved, getValidatedExperience } =
    useWorkExperienceInput();

  function handleAddExperience() {
    const experience = getValidatedExperience();
    if (!experience) return;
    addExperience(experience);
    resetInputs();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skillBlocked = checkUnsavedSkill();
    const expBlocked = checkUnsaved();
    if (skillBlocked || expBlocked) return;

    const user = await completeProfileMutation.mutateAsync({
      email,
      fullName,
      birthDate,
      keySkills,
      workExperience,
    });

    signIn(user);
    reset();
    navigate("/projects");
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-10 md:py-16">
      <section className="mx-auto w-full max-w-[980px]">
        <div className="mx-auto mb-4 w-fit">
          <LogoMark className="h-16 w-16" iconClassName="h-7 w-7" />
        </div>

        <h1 className="text-center text-4xl font-semibold text-text-primary md:text-5xl">Complete your profile</h1>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-lg text-text-secondary">
          Tell us about yourself so we can personalize your experience.
        </p>

        <Card className="mt-10 p-6 shadow-soft md:p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-2">
              <section className="space-y-4 border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-success">
                    <UserRound size={18} />
                  </span>
                  <div className="text-left">
                    <h2 className="text-3xl font-semibold text-text-primary">Personal Information</h2>
                    <p className="text-base text-text-secondary">Tell us about yourself</p>
                  </div>
                </div>

                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="e.g. Alex Smith"
                  value={fullName}
                  onChange={(event) => setProfileField("fullName", event.target.value)}
                  required
                />

                <BirthDateInput
                  id="birthDate"
                  value={birthDate}
                  onChange={(value) => setProfileField("birthDate", value)}
                  required
                />

                <Input
                  id="keySkills"
                  label="Key Skills"
                  placeholder="Type and press Enter"
                  value={skillInput}
                  onChange={(event) => onSkillInputChange(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className={warnedSkill ? "animate-pulse ring-2 ring-primary/60" : undefined}
                />

                <div className="flex flex-wrap gap-2">
                  {keySkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full bg-success/20 px-3 py-1 text-sm text-success"
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-success">
                    <BriefcaseBusiness size={18} />
                  </span>
                  <div className="text-left">
                    <h2 className="text-3xl font-semibold text-text-primary">Work Experience</h2>
                    <p className="text-base text-text-secondary">Tell us about work experience</p>
                  </div>
                </div>

                <WorkExperienceList items={workExperience} onRemove={removeExperience} />

                <WorkExperienceInputRow
                  idPrefix="register-"
                  jobTitleInput={jobTitleInput}
                  onJobTitleChange={onJobTitleChange}
                  yearsInput={yearsInput}
                  onYearsChange={onYearsChange}
                  onAdd={handleAddExperience}
                  warnedExperience={warnedExperience}
                />
              </section>
            </div>

            <div className="flex justify-center pt-2">
              <Button type="submit" className="h-12 w-full max-w-[420px] text-base" disabled={completeProfileMutation.isPending}>
                {completeProfileMutation.isPending ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
