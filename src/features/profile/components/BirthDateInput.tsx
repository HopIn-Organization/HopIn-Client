import { CalendarDays } from "lucide-react";
import { formatBirthDate, getMaxBirthDate } from "@/utils/date";

interface BirthDateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function BirthDateInput({ id, value, onChange, disabled, required }: BirthDateInputProps) {
  return (
    <label htmlFor={id} className="block space-y-2 text-sm">
      <span className="text-xs font-medium text-text-secondary">Birth Date</span>
      <div className="relative">
        <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/70" />
        <input
          id={id}
          type={disabled ? "text" : "date"}
          value={disabled ? formatBirthDate(value) : value}
          max={disabled ? undefined : getMaxBirthDate()}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-surface px-10 text-sm text-text-primary outline-none transition focus:border-primary disabled:bg-surface"
          disabled={disabled}
          required={required}
        />
      </div>
    </label>
  );
}
