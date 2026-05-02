import { Check } from "lucide-react";
import { classNames } from "@/utils/className";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={classNames("inline-flex cursor-pointer items-center gap-2", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`grid h-4 w-4 shrink-0 place-items-center rounded transition ${
          checked ? "bg-[#2DD4BF]" : "border border-border bg-surface"
        }`}
      >
        {checked && <Check size={10} strokeWidth={3} className="text-white" />}
      </button>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
