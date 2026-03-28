import { cn } from "@/utils/cn";

interface LogoMarkProps {
  className?: string;
  iconClassName?: string;
}

export function LogoMark({ className, iconClassName }: LogoMarkProps) {
  return (
    <div className={cn("grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft", className)}>
      <svg
        className={cn("h-8 w-8 text-primary", iconClassName)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20.9 8.5c-1.7-2.6-5.5-4.1-8.8-3.5-2.4.4-3.3 2.3-2 3.7 1 1.1 3.2 1.5 5.9 1.5m4.9-1.7c2.4.3 4.7 1.9 5.4 4.1.7 2.3-.3 4.6-2.7 5.2-1.8.4-3.8-.2-5.7-1.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.7 10.3c-3.2.5-5.5 2.7-6.4 5.8-.5 1.7.1 3 1.5 3.5 1.1.4 2.4.1 3.5-.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.1 14.4c2.8 2.9 3.4 6.9 1.4 9.7-1.2 1.8-1.1 2.8.8 3.5 2.4.9 5.3-.7 5.5-3.4.2-3.1-1.7-6.2-5.3-8.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="23.5" cy="13.7" r="0.9" fill="currentColor" />
      </svg>
    </div>
  );
}
