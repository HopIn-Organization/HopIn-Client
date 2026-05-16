import { Plus } from "lucide-react";
import { Input } from "@/ui/Input";

interface WorkExperienceInputRowProps {
  idPrefix?: string;
  jobTitleInput: string;
  onJobTitleChange: (value: string) => void;
  yearsInput: string;
  onYearsChange: (value: string) => void;
  onAdd: () => void;
  warnedExperience?: boolean;
}

export function WorkExperienceInputRow({
  idPrefix = "",
  jobTitleInput,
  onJobTitleChange,
  yearsInput,
  onYearsChange,
  onAdd,
  warnedExperience,
}: WorkExperienceInputRowProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
      <Input
        id={`${idPrefix}jobTitle`}
        label="Job Title"
        placeholder="e.g. Fullstack developer"
        value={jobTitleInput}
        onChange={(event) => onJobTitleChange(event.target.value)}
        className={warnedExperience ? "animate-pulse ring-2 ring-primary/60" : undefined}
      />
      <Input
        id={`${idPrefix}years`}
        type="number"
        min={0}
        label="Years of experience"
        placeholder="e.g. 3"
        value={yearsInput}
        onChange={(event) => onYearsChange(event.target.value)}
        className={warnedExperience ? "animate-pulse ring-2 ring-primary/60" : undefined}
      />
      <button
        type="button"
        onClick={onAdd}
        className={`grid h-11 w-11 place-items-center self-end rounded-full border bg-surface text-text-primary transition hover:bg-surface-muted ${
          warnedExperience ? "animate-pulse border-primary text-primary ring-4 ring-primary/60" : "border-border"
        }`}
        aria-label="Add work experience"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
