import { cn } from "@/utils/cn";
import { primaryLogoSrc } from "@/components/brand/logoSource";

interface LogoMarkProps {
  className?: string;
  iconClassName?: string;
  withBackground?: boolean;
}

export function LogoMark({ className, iconClassName, withBackground = true }: LogoMarkProps) {
  return (
    <div className={cn("grid h-14 w-14 place-items-center rounded-2xl", withBackground && "bg-primary-soft", className)}>
      <img
        src={primaryLogoSrc}
        alt="HopIn logo"
        className={cn("h-full w-full object-contain", iconClassName)}
      />
    </div>
  );
}
