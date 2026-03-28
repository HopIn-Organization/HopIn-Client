import { FormEvent, KeyboardEvent, useState } from "react";
import { BriefcaseBusiness, Plus, Trash2, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useCompleteProfileMutation } from "@/features/auth/hooks/useAuthMutations";
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

  const [skillInput, setSkillInput] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [yearsInput, setYearsInput] = useState("");

  function handleSkillKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const value = skillInput.trim();
    if (!value) return;

    addSkill(value);
    setSkillInput("");
  }

  function handleAddExperience() {
    const title = jobTitleInput.trim();
    const years = Number(yearsInput);

    if (!title || Number.isNaN(years) || years < 0) return;

    addExperience({ title, years });
    setJobTitleInput("");
    setYearsInput("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await completeProfileMutation.mutateAsync({
      email,
      fullName,
      birthDate,
      keySkills,
      workExperience,
    });

    signIn();
    reset();
    navigate("/projects");
  }

  return (
    <AuthLayout title="Complete your profile" subtitle="Tell us about yourself so we can personalize your experience.">
      <Card className="p-8 shadow-soft">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="space-y-4 border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#DDF7F4] text-success">
                  <UserRound size={18} />
                </span>
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-text-primary">Personal Information</h2>
                  <p className="text-base text-text-secondary">Tell us about yourself</p>
                </div>
              </div>

              <Input
                id="fullName"
                label="Full Name"
                placeholder="e.g Alex Smith"
                value={fullName}
                onChange={(event) => setProfileField("fullName", event.target.value)}
                required
              />

              <Input
                id="birthDate"
                label="Birth Date"
                type="date"
                value={birthDate}
                onChange={(event) => setProfileField("birthDate", event.target.value)}
                required
              />

              <Input
                id="keySkills"
                label="Key Skills"
                placeholder="Type and press Enter"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
              />

              <div className="flex flex-wrap gap-2">
                {keySkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full bg-[#DDF7F4] px-3 py-1 text-sm text-[#149E90]"
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#DDF7F4] text-success">
                  <BriefcaseBusiness size={18} />
                </span>
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-text-primary">Work Experience</h2>
                  <p className="text-base text-text-secondary">Tell us about work experience</p>
                </div>
              </div>

              <ul className="space-y-2 text-left">
                {workExperience.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-xl border border-[#9CE7DF] bg-[#E6FBF8] px-4 py-3 text-sm text-text-primary">
                    <span>{item.title}, {item.years} years</span>
                    <button type="button" onClick={() => removeExperience(item.id)} className="text-text-secondary">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto]">
                <Input
                  id="jobTitle"
                  label="Job Title"
                  placeholder="e.g Fullstack developer"
                  value={jobTitleInput}
                  onChange={(event) => setJobTitleInput(event.target.value)}
                />
                <Input
                  id="years"
                  label="Years of experience"
                  placeholder="e.g 3"
                  value={yearsInput}
                  onChange={(event) => setYearsInput(event.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="mt-7 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface-muted text-text-primary"
                >
                  <Plus size={16} />
                </button>
              </div>
            </section>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="h-14 w-full max-w-[420px] text-base" disabled={completeProfileMutation.isPending}>
              {completeProfileMutation.isPending ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
}
