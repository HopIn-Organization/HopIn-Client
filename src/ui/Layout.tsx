import { CSSProperties, PropsWithChildren } from "react";
import { classNames } from "@/utils/className";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export function Container({ className, children }: ContainerProps) {
  return <div className={classNames("mx-auto w-full max-w-[1120px] px-6", className)}>{children}</div>;
}

interface StackProps extends PropsWithChildren {
  className?: string;
  gap?: number;
}

export function Stack({ className, children, gap = 4 }: StackProps) {
  const style: CSSProperties = { gap: `${gap * 0.25}rem` };

  return (
    <div className={classNames("flex flex-col", className)} style={style}>
      {children}
    </div>
  );
}

interface GridProps extends PropsWithChildren {
  className?: string;
}

export function Grid({ className, children }: GridProps) {
  return <div className={classNames("grid grid-cols-1 gap-6 lg:grid-cols-2", className)}>{children}</div>;
}
