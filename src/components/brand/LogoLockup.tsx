import { cn } from "@/utils/cn";
import { primaryLogoSrc } from "@/components/brand/logoSource";

interface LogoLockupProps {
  className?: string;
  compact?: boolean;
}

export function LogoLockup({ className, compact = false }: LogoLockupProps) {
  return (
    <img
      src={primaryLogoSrc}
      alt="HopIn logo"
      className={cn("h-auto object-contain", compact ? "w-[96px]" : "w-[230px]", className)}
      aria-label="HopIn logo"
    />
  );
}
