import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { classNames } from "@/utils/className";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerActionText?: string;
  footerActionHref?: string;
  compact?: boolean;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerActionText,
  footerActionHref,
  compact = false,
}: AuthLayoutProps) {
  return (
    <main className="relative grid min-h-screen place-items-center bg-bg px-4 py-8 lg:py-12">
      <section
        className={classNames("w-full max-w-[520px] text-center", compact && "max-w-[420px]")}
      >
        <div className="mb-4 flex justify-center lg:mb-6">
          <LogoLockup className="w-[40px] lg:w-[80px]" />
        </div>

        <h1 className="text-3xl font-semibold leading-tight text-text-primary lg:text-[46px]">
          {title}
        </h1>
        <p className="mt-2 text-lg text-text-secondary lg:mt-3 lg:text-[26px]">{subtitle}</p>

        <div className="mt-6 lg:mt-9">{children}</div>

        {footerText && footerActionText && footerActionHref && (
          <p className="mt-6 text-base text-text-secondary lg:mt-8 lg:text-lg">
            {footerText}{" "}
            <Link to={footerActionHref} className="font-medium text-primary">
              {footerActionText}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
