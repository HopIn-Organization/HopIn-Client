import { useOnboardingPlansQuery } from "@/features/onboarding/hooks/useOnboardingData";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";

export function OnboardingPlanPage() {
  const { data: plans = [], isLoading } = useOnboardingPlansQuery();
  const plan = plans[0];

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading onboarding plan...</p>;
  }

  if (!plan) {
    return <p className="text-sm text-text-secondary">No onboarding plan found.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Onboarding Journey</h1>
        <p className="mt-2 text-lg text-text-secondary">
          {plan.employeeName} • {plan.trackName}
        </p>
      </header>

      <PlanTimeline plan={plan} />
    </section>
  );
}
