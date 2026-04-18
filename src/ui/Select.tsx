import { SelectHTMLAttributes } from "react";
import { classNames } from "@/utils/className";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, id, children, ...props }: SelectProps) {
  return (
    <label htmlFor={id} className="block space-y-2 text-sm">
      {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
      <select
        id={id}
        className={classNames(
          "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition focus:border-primary",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
