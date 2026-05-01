import { PropsWithChildren } from "react";
import { X } from "lucide-react";
import { classNames } from "@/utils/className";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className={classNames("w-full max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-soft")}>
        <button
          onClick={onClose}
          className="mb-4 rounded-full p-1 text-text-secondary transition hover:bg-surface-muted"
        >
          <X size={20} />
        </button>
        <h3 className="mb-8 text-3xl font-bold text-text-primary">{title}</h3>
        {children}
      </div>
    </div>
  );
}
