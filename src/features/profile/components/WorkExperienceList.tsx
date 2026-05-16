import { Trash2 } from "lucide-react";
import { WorkExperienceItem } from "@/types/auth";

interface WorkExperienceListProps {
  items: WorkExperienceItem[];
  onRemove?: ((id: string) => void) | undefined;
}

export function WorkExperienceList({ items, onRemove }: WorkExperienceListProps) {
  return (
    <ul className="space-y-2 text-left">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-success/40 bg-success/15 px-4 py-3 text-sm text-text-primary"
        >
          <span>
            {item.title}, {item.years} {item.years === 1 ? "year" : "years"}
          </span>
          {onRemove && (
            <button type="button" onClick={() => onRemove(item.id)} className="text-text-secondary transition hover:text-text-primary">
              <Trash2 size={14} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
