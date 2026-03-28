import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGeneratePlanMutation, useSaveTeamLeadRequirementMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";

export function OnboardingReviewPage() {
  const navigate = useNavigate();
  const saveRequirementMutation = useSaveTeamLeadRequirementMutation();
  const generatePlanMutation = useGeneratePlanMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const requirement = {
      id: "req_dynamic_1",
      projectId: "p_1",
      roleTitle: String(formData.get("roleTitle") ?? ""),
      expectations: String(formData.get("expectations") ?? ""),
      desiredTechnologies: [
        {
          name: String(formData.get("technology") ?? "React"),
          minimumLevel: String(formData.get("minimumLevel") ?? "Beginner") as "Beginner" | "Intermediate" | "Advanced",
        },
      ],
    };

    const employee = {
      userId: "u_2",
      background: "Imported from onboarding/start",
      yearsInTech: 1,
      knownTechnologies: [
        {
          name: "React",
          level: "beginner" as const,
        },
      ],
    };

    await saveRequirementMutation.mutateAsync(requirement);
    await generatePlanMutation.mutateAsync({ employee, requirement });

    navigate("/onboarding/plan");
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Team Lead Requirements</h1>
        <p className="mt-2 text-lg text-text-secondary">Define expectations and required skills for this role.</p>
      </header>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input id="roleTitle" name="roleTitle" label="Role Title" placeholder="Fullstack Developer" required />
          <Input id="technology" name="technology" label="Desired Technology" placeholder="React" required />

          <Select id="minimumLevel" name="minimumLevel" label="Minimum Level">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>

          <label htmlFor="expectations" className="block space-y-2">
            <span className="text-xs font-medium text-text-secondary">Expectations</span>
            <textarea
              id="expectations"
              name="expectations"
              className="h-28 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Set role expectations and onboarding success criteria"
              required
            />
          </label>

          <div className="flex justify-end">
            <Button type="submit" disabled={saveRequirementMutation.isPending || generatePlanMutation.isPending}>
              {saveRequirementMutation.isPending || generatePlanMutation.isPending ? "Generating..." : "Generate Plan"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
