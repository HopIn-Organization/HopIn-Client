import { Check, ChevronDown, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompleteTaskMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { OnboardingPlan, PlanTask } from "@/types/onboarding";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface PlanTimelineProps {
  plan: OnboardingPlan;
}

export function PlanTimeline({ plan }: PlanTimelineProps) {
  const [tasks, setTasks] = useState<PlanTask[]>(plan.tasks);

  useEffect(() => {
    setTasks(plan.tasks);
  }, [plan.tasks]);

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = plan.progress;

  function handleTaskComplete(updatedTask: PlanTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-text-primary">Overall Progress</p>
          <span className="rounded-lg bg-[#E9FCFA] px-3 py-1 text-xs font-semibold text-[#13AFA1]">
            {progressPercent}% Complete
          </span>
        </div>

        <div className="h-2 rounded-full bg-border">
          <div className="h-2 rounded-full bg-success" style={{ width: `${progressPercent}%` }} />
        </div>

        <p className="mt-3 flex items-center justify-between text-xs text-text-secondary">
          <span>{completedCount} of {tasks.length} tasks completed</span>
          <span>{tasks.length - completedCount} remaining</span>
        </p>
      </Card>

      <div className="relative ml-5 border-l-2 border-primary-soft pl-6">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onComplete={handleTaskComplete} />
        ))}
      </div>
    </div>
  );
}

function TaskRow({ task, onComplete }: { task: PlanTask; onComplete: (task: PlanTask) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutateAsync: completeTask, isPending } = useCompleteTaskMutation();

  async function handleMarkComplete() {
    const updated = await completeTask(task.id);
    onComplete({ ...task, isCompleted: updated.isCompleted });
  }

  return (
    <article className="relative mb-5">
      <div className="absolute -left-[38px] top-6 grid h-6 w-6 place-items-center rounded-full border-2 border-bg bg-surface">
        {task.isCompleted ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-success text-white">
            <Check size={12} />
          </span>
        ) : isExpanded ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
            <Circle size={8} fill="white" />
          </span>
        ) : (
          <span className="grid h-5 w-5 place-items-center rounded-full border border-border bg-surface-muted" />
        )}
      </div>

      <Card className={isExpanded ? "border-primary/30 p-5" : "p-5"}>
        <div className="flex cursor-pointer items-start justify-between" onClick={() => setIsExpanded((prev) => !prev)}>
          <h3 className="text-lg font-semibold text-text-primary">{task.title}</h3>
          <ChevronDown size={16} className={`mt-1 text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
        <p className="mt-3 text-sm text-text-secondary">{task.description}</p>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {!!task.links?.length && (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-text-primary">Relevant Links:</p>
                {task.links.map((link) => (
                  <a key={link} href={link} className="block text-primary underline" target="_blank" rel="noreferrer">
                    {link}
                  </a>
                ))}
              </div>
            )}

            {!!task.subtasks?.length && (
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Subtasks</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={subtask.isCompleted} readOnly />
                      <span>{subtask.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!task.isCompleted && (
              <Button className="w-fit" onClick={handleMarkComplete} disabled={isPending}>
                {isPending ? "Saving..." : "Mark Complete"}
              </Button>
            )}
          </div>
        )}
      </Card>
    </article>
  );
}
