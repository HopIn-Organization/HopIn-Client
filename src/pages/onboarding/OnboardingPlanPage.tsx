import { useLocation } from "react-router-dom";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";
import { OnboardingPlan } from "@/types/onboarding";

export function OnboardingPlanPage() {
  const location = useLocation();
  const plan = location.state?.plan as OnboardingPlan | undefined;

  if (!plan) {
    return <p className="text-sm text-text-secondary">No onboarding plan found. Please generate one first.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Onboarding Journey</h1>
        <p className="mt-2 text-lg text-text-secondary">
          {plan.user.name} • {plan.job.title}
        </p>
      </header>

      <PlanTimeline plan={plan} />
    </section>
  );
}
