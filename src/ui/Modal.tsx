import { PropsWithChildren } from "react";
import { X } from "lucide-react";
import { classNames } from "@/utils/className";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className={classNames("flex w-full max-w-xl flex-col max-h-[90vh] rounded-2xl border border-border bg-surface p-8 shadow-soft", className)}>
        <button
          onClick={onClose}
          className="mb-4 shrink-0 rounded-full p-1 text-text-secondary transition hover:bg-surface-muted"
        >
          <X size={20} />
        </button>
        <h3 className="mb-8 shrink-0 text-3xl font-bold text-text-primary">{title}</h3>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
