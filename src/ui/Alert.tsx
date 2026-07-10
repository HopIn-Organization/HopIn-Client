import { PropsWithChildren, ReactNode } from "react";
import { classNames } from "@/utils/className";

type AlertVariant = "info" | "warning";

interface AlertProps extends PropsWithChildren {
  variant?: AlertVariant;
  icon?: ReactNode;
  className?: string;
}

export function Alert({ variant = "info", icon, className, children }: AlertProps) {
  return (
    <div
      className={classNames(
        "flex items-start gap-3 rounded-2xl border p-4 text-sm",
        variant === "info" && "border-border bg-surface-muted text-text-secondary",
        variant === "warning" && "border-amber-300 bg-amber-50 text-amber-800",
        className,
      )}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="space-y-1 leading-relaxed">{children}</div>
    </div>
  );
}
