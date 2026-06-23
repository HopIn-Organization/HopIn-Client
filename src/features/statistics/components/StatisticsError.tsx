import { AlertCircle } from "lucide-react";
import { Button } from "@/ui/Button";

interface StatisticsErrorProps {
    message?: string;
    onRetry: () => void;
}

export function StatisticsError({
    message = "Failed to load statistics",
    onRetry,
}: StatisticsErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={24} />
            </div>
            <p className="text-sm text-text-secondary">{message}</p>
            <Button variant="primary" onClick={onRetry}>
                Retry
            </Button>
        </div>
    );
}
