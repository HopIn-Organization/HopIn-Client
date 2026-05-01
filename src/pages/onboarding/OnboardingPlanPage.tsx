import { useParams } from "react-router-dom";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";
import { useOnboardingPlanQuery } from "@/features/onboarding/hooks/useOnboardingData";

export function OnboardingPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  console.log("Loading plan with ID:", planId);
  const { data: plan } = useOnboardingPlanQuery(planId ? Number(planId) : undefined);

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
