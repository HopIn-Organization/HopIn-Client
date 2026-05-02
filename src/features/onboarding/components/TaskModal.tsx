import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useUpsertTaskMutation } from "@/features/onboarding/hooks/useOnboardingData";
import { PlanTask, UpsertTaskPayload } from "@/types/onboarding";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Checkbox } from "@/ui/Checkbox";
import { Modal } from "@/ui/Modal";

interface TaskModalTask extends Pick<PlanTask, "id" | "title" | "description" | "isCompleted"> {
  estimatedDays?: number;
  links?: string[];
  parentId?: number | null;
  subtasks?: PlanTask[];
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onboardingId: number;
  task?: TaskModalTask;
  nextOrder?: number;
}

export function TaskModal({ open, onClose, onboardingId, task, nextOrder }: TaskModalProps) {
  const isEdit = task !== undefined;
  const isSubtask = !!task?.parentId;
  const { mutateAsync: upsertTask, isPending } = useUpsertTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [parentId, setParentId] = useState("");
  type SubtaskDraft = { id: number | null; title: string; isCompleted: boolean };
  const [subtasks, setSubtasks] = useState<SubtaskDraft[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState<number | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setEstimatedDays(task?.estimatedDays != null ? String(task.estimatedDays) : "");
    setIsCompleted(task?.isCompleted ?? false);
    setLinks(task?.links ?? []);
    setLinkInput("");
    setParentId(task?.parentId != null ? String(task.parentId) : "");
    setSubtasks(task?.subtasks?.map((s) => ({ id: s.id, title: s.title, isCompleted: s.isCompleted })) ?? []);
    setSubtaskInput("");
    setEditingSubtaskIndex(null);
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
      ? { id: task.id, title, description, estimatedDays: Number(estimatedDays), isCompleted, links, onboardingId, parentId: parentId ? Number(parentId) : null }
      : { order: nextOrder ?? 1, title, description, estimatedDays: Number(estimatedDays), isCompleted, links, onboardingId, parentId: parentId ? Number(parentId) : null };
    const subtasksPayload = isEdit
      ? subtasks.map((s, i) => (s.id !== null
          ? { id: s.id, title: s.title, description: "", order: i + 1, estimatedDays: 1, isCompleted: s.isCompleted }
          : { title: s.title, description: "", order: i + 1, estimatedDays: 1, isCompleted: s.isCompleted }))
      : undefined;
    await upsertTask({ ...payload, ...(subtasksPayload !== undefined ? { subtasks: subtasksPayload } : {}) } as UpsertTaskPayload);
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
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
          />
        </label>

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


        {!isSubtask && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-text-secondary">Subtasks</span>
            {subtasks.length > 0 && (
              <ul className="space-y-1">
                {subtasks.map((subtask, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-1.5 text-sm">
                    {editingSubtaskIndex === i ? (
                      <>
                        <input
                          autoFocus
                          value={editingSubtaskTitle}
                          onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              setSubtasks((prev) => prev.map((s, idx) => idx === i ? { ...s, title: editingSubtaskTitle } : s));
                              setEditingSubtaskIndex(null);
                            } else if (e.key === "Escape") {
                              setEditingSubtaskIndex(null);
                            }
                          }}
                          className="flex-1 rounded-lg border border-primary bg-surface px-2 py-0.5 text-sm text-text-primary outline-none"
                        />
                        <button type="button" onClick={() => {
                          setSubtasks((prev) => prev.map((s, idx) => idx === i ? { ...s, title: editingSubtaskTitle } : s));
                          setEditingSubtaskIndex(null);
                        }} className="shrink-0 text-text-secondary hover:text-text-primary">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-text-primary">{subtask.title}</span>
                        <button type="button" onClick={() => { setEditingSubtaskIndex(i); setEditingSubtaskTitle(subtask.title); }} className="shrink-0 text-text-secondary hover:text-text-primary">
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubtasks((prev) => prev.filter((_, idx) => idx !== i));
                          }}
                          className="shrink-0 text-text-secondary hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const trimmed = subtaskInput.trim();
                    if (trimmed) { setSubtasks((prev) => [...prev, { id: null, title: trimmed, isCompleted: false }]); setSubtaskInput(""); }
                  }
                }}
                placeholder="Add a subtask..."
                className="h-11 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
              />
              <Button type="button" variant="outline" onClick={() => {
                const trimmed = subtaskInput.trim();
                if (trimmed) { setSubtasks((prev) => [...prev, { id: null, title: trimmed, isCompleted: false }]); setSubtaskInput(""); }
              }}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        )}

        {isEdit && (
          <Checkbox
            checked={isCompleted}
            onChange={setIsCompleted}
            label="Mark as completed"
          />
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
