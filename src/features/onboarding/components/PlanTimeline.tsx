import { Check, ChevronDown, Circle } from "lucide-react";
import { OnboardingPlan, PlanTask } from "@/types/onboarding";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface PlanTimelineProps {
  plan: OnboardingPlan;
}

export function PlanTimeline({ plan }: PlanTimelineProps) {
  const completedTasks = plan.tasks.filter((task) => task.completed).length;
  const remainingTasks = plan.tasks.length - completedTasks;
  const progressPercent = plan.tasks.length > 0 ? Math.round((completedTasks / plan.tasks.length) * 100) : 0;

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
          <span>{completedTasks} of {plan.tasks.length} tasks completed</span>
          <span>{remainingTasks} remaining</span>
        </p>
      </Card>

      <div className="relative ml-5 border-l-2 border-primary-soft pl-6">
        {plan.tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: PlanTask }) {
  const showExpanded = task.title === "Learn React";

  return (
    <article className="relative mb-5">
      <div className="absolute -left-[38px] top-6 grid h-6 w-6 place-items-center rounded-full border-2 border-bg bg-surface">
        {task.completed ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-success text-white">
            <Check size={12} />
          </span>
        ) : showExpanded ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white">
            <Circle size={8} fill="white" />
          </span>
        ) : (
          <span className="grid h-5 w-5 place-items-center rounded-full border border-border bg-surface-muted" />
        )}
      </div>

      <Card className={showExpanded ? "border-primary/30 p-5" : "p-5"}>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-text-primary">{task.title}</h3>
          <ChevronDown size={16} className="mt-1 text-text-secondary" />
        </div>
        <p className="mt-3 text-sm text-text-secondary">{task.description}</p>

        {showExpanded && (
          <div className="mt-4 space-y-4">
            {!!task.links?.length && (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-text-primary">Relevant Links:</p>
                {task.links.map((link) => (
                  <a key={link.url} href={link.url} className="block text-primary underline" target="_blank" rel="noreferrer">
                    {link.label}
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
                      <input type="checkbox" checked={subtask.completed} readOnly />
                      <span>{subtask.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button className="w-fit">Mark Complete</Button>
          </div>
        )}
      </Card>
    </article>
  );
}
