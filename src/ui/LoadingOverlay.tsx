import { Spinner } from "@/ui/Spinner";

interface LoadingOverlayProps {
  label?: string;
}

export function LoadingOverlay({ label }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-surface/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={36} />
        {label && <p className="text-sm text-text-secondary">{label}</p>}
      </div>
    </div>
  );
}
