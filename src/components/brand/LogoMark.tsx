import { classNames } from "@/utils/className";
import { primaryLogoSrc } from "@/components/brand/logoSource";

interface LogoMarkProps {
  className?: string;
  iconClassName?: string;
  withBackground?: boolean;
}

export function LogoMark({ className, iconClassName, withBackground = true }: LogoMarkProps) {
  return (
    <div className={classNames("grid h-14 w-14 place-items-center rounded-2xl", withBackground && "bg-primary-soft", className)}>
      <img
        src={primaryLogoSrc}
        alt="HopIn logo"
        className={classNames("h-full w-full object-contain", iconClassName)}
      />
    </div>
  );
}
