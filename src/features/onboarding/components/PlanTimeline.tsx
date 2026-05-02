import { Check, ChevronDown, Circle, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCompleteTaskMutation, useDeleteTaskMutation, useReorderTaskMutation, useUpsertTaskMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { OnboardingPlan, PlanTask } from "@/types/onboarding";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Modal } from "@/ui/Modal";
import { TaskModal } from "./TaskModal";

interface PlanTimelineProps {
  plan: OnboardingPlan;
}

export function PlanTimeline({ plan }: PlanTimelineProps) {
  const [tasks, setTasks] = useState<PlanTask[]>(plan.tasks);
  const [editingTask, setEditingTask] = useState<PlanTask | null>(null);
  const { mutateAsync: reorderTask } = useReorderTaskMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    setTasks(plan.tasks);
  }, [plan.tasks]);

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = plan.progress;

  function handleTaskComplete(updatedTask: PlanTask) {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const movedTask = tasks[oldIndex];
    if (oldIndex === -1 || newIndex === -1 || !movedTask) return;
    const previousTasks = tasks;
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);

    // All tasks in the affected range shift by ±1; the moved task lands at newIndex.
    // Slice that range from the reordered array and assign each its new 1-based order.
    const [rangeStart, rangeEnd] = oldIndex < newIndex
      ? [oldIndex, newIndex]   // dragged down: tasks above moved task shift back
      : [newIndex, oldIndex];  // dragged up: tasks below moved task shift forward

    const updates = reordered
      .slice(rangeStart, rangeEnd + 1)
      .map((task, i) => reorderTask({ id: task.id, order: rangeStart + i + 1, onboardingId: plan.id }));

    try {
      await Promise.all(updates);
    } catch {
      setTasks(previousTasks);
    }
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="relative ml-5 border-l-2 border-primary-soft pl-6">
            {tasks.map((task) => (
              <SortableTaskRow key={task.id} task={task} onboardingId={plan.id} onComplete={handleTaskComplete} onEdit={() => setEditingTask(task)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingTask && (
        <TaskModal
          open={true}
          onClose={() => setEditingTask(null)}
          onboardingId={plan.id}
          task={editingTask}
        />
      )}
    </div>
  );
}

function SortableTaskRow(props: { task: PlanTask; onboardingId: number; onComplete: (t: PlanTask) => void; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
    >
      <TaskRow {...props} dragHandleListeners={listeners} />
    </div>
  );
}

function TaskRow({ task, onboardingId, onComplete, onEdit, dragHandleListeners }: { task: PlanTask; onboardingId: number; onComplete: (task: PlanTask) => void; onEdit: () => void; dragHandleListeners?: ReturnType<typeof useSortable>["listeners"] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutateAsync: completeTask, isPending } = useCompleteTaskMutation();
  const { mutateAsync: upsertTask } = useUpsertTaskMutation();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();

  async function handleMarkComplete() {
    const updated = await completeTask(task.id);
    onComplete({ ...task, isCompleted: updated.isCompleted });
  }

  async function handleDelete() {
    await deleteTask(task.id);
    setConfirmDelete(false);
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
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              {...dragHandleListeners}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab rounded-full p-1 text-text-secondary transition hover:bg-surface-muted active:cursor-grabbing"
            >
              <GripVertical size={14} />
            </button>
            <ChevronDown size={16} className={`text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </div>
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
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = await upsertTask({ id: Number(subtask.id), isCompleted: !subtask.isCompleted, onboardingId });
                          onComplete({ ...task, subtasks: task.subtasks!.map((s) =>
                            s.id === subtask.id ? { ...s, isCompleted: updated.isCompleted } : s,
                          )});
                        }}
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded ${subtask.isCompleted ? "bg-[#2DD4BF]" : "border border-border bg-surface"}`}
                        aria-checked={subtask.isCompleted}
                        role="checkbox"
                      >
                        {subtask.isCompleted && <Check size={10} strokeWidth={3} className="text-white" />}
                      </button>
                      <span className={subtask.isCompleted ? "line-through opacity-50" : ""}>{subtask.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3">
              {!task.isCompleted && (
                <Button className="w-fit" onClick={handleMarkComplete} disabled={isPending}>
                  {isPending ? "Saving..." : "Mark Complete"}
                </Button>
              )}
              <Button type="button" variant="outline" className="w-fit" onClick={onEdit}>
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="ml-auto w-fit text-red-500 hover:border-red-400 hover:bg-red-50"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Task" className="p-6">
        <p className="mb-6 text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-semibold text-text-primary">"{task.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </article>
  );
}
