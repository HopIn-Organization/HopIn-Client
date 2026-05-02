import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TaskModal } from "@/features/onboarding/components/TaskModal";
import { PlanTimeline } from "@/features/onboarding/components/PlanTimeline";
import { useOnboardingPlanQuery } from "@/features/onboarding/hooks/useOnboardingData";
import { Button } from "@/ui/Button";

export function OnboardingPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const { data: plan } = useOnboardingPlanQuery(planId ? Number(planId) : undefined);
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (!plan) {
    return <p className="text-sm text-text-secondary">No onboarding plan found. Please generate one first.</p>;
  }

  return (
    <>
      <Link
        to={`/projects/${plan.project.id}/details`}
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to Project
      </Link>

      <section className="mx-auto w-full max-w-5xl space-y-6">
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
    </>
  );
}
