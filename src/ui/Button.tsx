import { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
        variant === "primary" && "bg-primary text-white shadow-soft hover:opacity-95",
        variant === "secondary" && "bg-primary-soft text-primary hover:bg-primary-soft/80",
        variant === "outline" && "border border-border bg-surface text-text-primary hover:bg-surface-muted",
        variant === "ghost" && "text-text-secondary hover:bg-surface-muted",
        className,
      )}
      {...props}
    />
  );
}
