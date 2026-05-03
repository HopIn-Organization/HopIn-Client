import type { FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { useGeneratePlanMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function OnboardingReviewPage() {
  const navigate = useNavigate();
  const generatePlanMutation = useGeneratePlanMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userId = Number(formData.get("userId") ?? 1);
    const jobId = Number(formData.get("jobId") ?? 1);
    const daysDuration = Number(formData.get("daysDuration") ?? 30);
    const documentsRaw = String(formData.get("documents") ?? "").trim();
    const documents = documentsRaw ? [documentsRaw] : [];

    await generatePlanMutation.mutateAsync({ userId, jobId, daysDuration, documents });

    navigate('/projects');
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Generate Onboarding Plan</h1>
        <p className="mt-2 text-lg text-text-secondary">Provide the employee and job details to generate a personalized onboarding plan.</p>
      </header>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input id="userId" name="userId" type="number" min={1} label="User ID" defaultValue={1} required />
          <Input id="jobId" name="jobId" type="number" min={1} label="Job ID" defaultValue={1} required />
          <Input id="daysDuration" name="daysDuration" type="number" min={1} label="Duration (days)" defaultValue={30} required />

          <label htmlFor="documents" className="block space-y-2">
            <span className="text-xs font-medium text-text-secondary">Custom Document (optional)</span>
            <textarea
              id="documents"
              name="documents"
              className="h-28 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Paste any onboarding guide, project context, or team procedures to customize the plan"
            />
          </label>

          {generatePlanMutation.isSuccess && (
            <p className="text-sm text-text-secondary">Generation started — you'll be notified when it's ready.</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={generatePlanMutation.isPending}>
              {generatePlanMutation.isPending ? "Starting..." : "Generate Plan"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
