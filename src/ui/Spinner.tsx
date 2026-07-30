import { Loader2 } from "lucide-react";
import { classNames } from "@/utils/className";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return <Loader2 className={classNames("animate-spin text-primary", className)} size={size} />;
}
