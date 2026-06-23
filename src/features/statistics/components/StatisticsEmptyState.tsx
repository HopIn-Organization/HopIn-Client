import { BarChart3 } from "lucide-react";

interface StatisticsEmptyStateProps {
    message: string;
}

export function StatisticsEmptyState({ message }: StatisticsEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <BarChart3 size={40} className="mb-3 text-gray-300" />
            <p className="text-sm text-text-secondary">{message}</p>
        </div>
    );
}
