import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useUpsertTaskMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { PlanTask, UpsertTaskPayload } from "@/types/onboarding";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Modal } from "@/ui/Modal";

interface TaskModalTask extends Pick<PlanTask, "id" | "title" | "description" | "isCompleted"> {
  order?: number;
  estimatedDays?: number;
  links?: string[];
  parentId?: number | null;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onboardingId: number;
  task?: TaskModalTask;
}

export function TaskModal({ open, onClose, onboardingId, task }: TaskModalProps) {
  const isEdit = task !== undefined;
  const { mutateAsync: upsertTask, isPending } = useUpsertTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setOrder(task?.order != null ? String(task.order) : "");
    setEstimatedDays(task?.estimatedDays != null ? String(task.estimatedDays) : "");
    setIsCompleted(task?.isCompleted ?? false);
    setLinks(task?.links ?? []);
    setLinkInput("");
    setParentId(task?.parentId != null ? String(task.parentId) : "");
  }, [open, task?.id]);

  function handleAddLink() {
    const trimmed = linkInput.trim();
    if (trimmed) {
      setLinks((prev) => [...prev, trimmed]);
      setLinkInput("");
    }
  }

  function handleRemoveLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: UpsertTaskPayload = isEdit
      ? { id: task.id, order: Number(order), title, description, estimatedDays: Number(estimatedDays), isCompleted, links, onboardingId, parentId: parentId ? Number(parentId) : null }
      : { order: Number(order), title, description, estimatedDays: Number(estimatedDays), isCompleted, links, onboardingId, parentId: parentId ? Number(parentId) : null };
    await upsertTask(payload);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Task" : "Add Task"} className="p-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="task-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required={!isEdit}
        />

        <label className="block space-y-2 text-sm">
          <span className="text-xs font-medium text-text-secondary">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            required={!isEdit}
            rows={2}
            className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="task-order"
            label="Order"
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="1"
            required={!isEdit}
          />
          <Input
            id="task-estimated-days"
            label="Estimated Days"
            type="number"
            min={1}
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(e.target.value)}
            placeholder="3"
            required={!isEdit}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-text-secondary">Links</span>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLink();
                }
              }}
              placeholder="https://example.com"
              className="h-11 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
            />
            <Button type="button" variant="outline" onClick={handleAddLink}>
              <Plus size={16} />
            </Button>
          </div>
          {links.length > 0 && (
            <ul className="space-y-1">
              {links.map((link, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-1.5 text-sm">
                  <span className="truncate text-primary">{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(i)}
                    className="ml-2 shrink-0 text-text-secondary hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isEdit && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
            <span>Mark as completed</span>
          </label>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
