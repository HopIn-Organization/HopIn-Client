import { useLocation } from "react-router-dom";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";
import { useProjectQuery } from "@/features/projects/hooks";
import { OnboardingPlan } from "@/types/onboarding";

export function OnboardingPlanPage() {
  const location = useLocation();
  const plan = location.state?.plan as OnboardingPlan | undefined;

  const { data: project } = useProjectQuery(plan ? String(plan.projectId) : "");

  if (!plan) {
    return <p className="text-sm text-text-secondary">No onboarding plan found. Please generate one first.</p>;
  }

  const member = project?.members?.find((m) => m.user.id === plan.userId);
  const userName = member?.user.name ?? `User ${plan.userId}`;
  const jobTitle = member?.job.title ?? project?.jobs?.find((j) => j.id === plan.jobId)?.title ?? `Job ${plan.jobId}`;

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Onboarding Journey</h1>
        <p className="mt-2 text-lg text-text-secondary">
          {userName} • {jobTitle}
        </p>
      </header>

      <PlanTimeline plan={plan} />
    </section>
  );
}
