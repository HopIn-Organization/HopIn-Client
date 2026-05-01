import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { TaskModal } from "@/features/onboarding/components/TaskModal";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";
import { useOnboardingPlanQuery } from "@/features/onboarding/hooks/useOnboardingData";
import { Button } from "@/ui/Button";

export function OnboardingPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  console.log("Loading plan with ID:", planId);
  const { data: plan } = useOnboardingPlanQuery(planId ? Number(planId) : undefined);
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (!plan) {
    return <p className="text-sm text-text-secondary">No onboarding plan found. Please generate one first.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-text-primary">Onboarding Journey</h1>
          <p className="mt-2 text-lg text-text-secondary">
            {plan.user.name} • {plan.job.title}
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          Add Task
        </Button>
      </header>

      <PlanTimeline plan={plan} />

      <TaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onboardingId={plan.id}
        nextOrder={(plan.tasks.at(-1)?.order || 0) + 1}
      />
    </section>
  );
}
