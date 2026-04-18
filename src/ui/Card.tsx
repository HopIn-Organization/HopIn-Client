import { PropsWithChildren } from "react";
import { classNames } from "@/utils/className";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return <div className={classNames("rounded-2xl border border-border bg-surface", className)}>{children}</div>;
}
