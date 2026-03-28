import { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return <div className={cn("rounded-2xl border border-border bg-surface", className)}>{children}</div>;
}
