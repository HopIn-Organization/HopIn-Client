import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "@/components/brand/LogoMark";
import { cn } from "@/utils/cn";

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
    <main className="relative grid min-h-screen place-items-center bg-bg px-4 py-12">
      <div className="pointer-events-none absolute right-0 top-4 h-px w-[270px] bg-border" />

      <section className={cn("w-full max-w-[520px] text-center", compact && "max-w-[420px]")}>
        <div className="mb-6 flex justify-center">
          <LogoMark />
        </div>

        <h1 className="text-[46px] font-semibold leading-tight text-text-primary md:text-[52px]">{title}</h1>
        <p className="mt-3 text-[31px] text-text-secondary md:text-[28px]">{subtitle}</p>

        <div className="mt-9">{children}</div>

        {footerText && footerActionText && footerActionHref && (
          <p className="mt-8 text-lg text-text-secondary">
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
