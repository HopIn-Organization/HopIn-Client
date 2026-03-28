import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSaveEmployeeProfileMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";

export function OnboardingStartPage() {
  const navigate = useNavigate();
  const saveMutation = useSaveEmployeeProfileMutation();
  const [techName, setTechName] = useState("React");
  const [techLevel, setTechLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [technologies, setTechnologies] = useState<Array<{ name: string; level: "beginner" | "intermediate" | "advanced" }>>([]);

  const canAddTechnology = useMemo(() => techName.trim().length > 0, [techName]);

  function addTechnology() {
    if (!canAddTechnology) return;
    setTechnologies((current) => [...current, { name: techName.trim(), level: techLevel }]);
    setTechName("");
    setTechLevel("beginner");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await saveMutation.mutateAsync({
      userId: "u_2",
      background: String(formData.get("background") ?? ""),
      yearsInTech: Number(formData.get("yearsInTech") ?? 0),
      knownTechnologies: technologies,
    });

    navigate("/onboarding/review");
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Employee Onboarding Input</h1>
        <p className="mt-2 text-lg text-text-secondary">Tell us your background and your current technology familiarity.</p>
      </header>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label htmlFor="background" className="block space-y-2">
            <span className="text-xs font-medium text-text-secondary">Background</span>
            <textarea
              id="background"
              name="background"
              required
              className="h-28 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Describe your education and previous work"
            />
          </label>

          <Input id="yearsInTech" name="yearsInTech" type="number" min={0} max={30} label="Years in Technology" required />

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Skills & Familiarity</p>
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <Input value={techName} onChange={(event) => setTechName(event.target.value)} placeholder="Technology name" />
              <Select value={techLevel} onChange={(event) => setTechLevel(event.target.value as "beginner" | "intermediate" | "advanced") }>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
              <Button type="button" variant="outline" onClick={addTechnology}>
                Add
              </Button>
            </div>

            <ul className="mt-3 space-y-2 text-sm">
              {technologies.map((technology) => (
                <li key={`${technology.name}-${technology.level}`} className="rounded-lg bg-surface px-3 py-2 text-text-secondary">
                  {technology.name} • {technology.level}
                </li>
              ))}
              {technologies.length === 0 && <li className="text-text-secondary">No technologies added yet.</li>}
            </ul>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
