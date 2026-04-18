import { ReactNode } from "react";
import { classNames } from "@/utils/className";

export interface TabItem<T extends string> {
  label: ReactNode;
  value: T;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  activeTriggerClassName?: string;
  inactiveTriggerClassName?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  onValueChange,
  className,
  listClassName,
  triggerClassName,
  activeTriggerClassName,
  inactiveTriggerClassName,
}: TabsProps<T>) {
  return (
    <div className={classNames("border-b border-border", className)}>
      <div className={classNames("flex gap-8", listClassName)} role="tablist">
        {items.map((item) => {
          const isActive = item.value === value;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onValueChange(item.value)}
              className={classNames(
                "border-b-2 px-3 py-3 text-sm transition",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
                triggerClassName,
                isActive ? activeTriggerClassName : inactiveTriggerClassName,
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
