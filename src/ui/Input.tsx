import { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <label htmlFor={id} className="block space-y-2 text-sm">
      {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary",
          className,
        )}
        {...props}
      />
    </label>
  );
}
