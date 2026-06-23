import { Clock } from "lucide-react";
import { Card } from "@/ui/Card";
import { StatisticsEmptyState } from "./StatisticsEmptyState";

interface AvgOnboardTimeCardProps {
    avgDays: number | null | undefined;
}

export function AvgOnboardTimeCard({ avgDays }: AvgOnboardTimeCardProps) {
    if (avgDays == null) {
        return (
            <section aria-label="Average onboard time">
                <Card className="relative p-6">
                    <StatisticsEmptyState message="No onboarding data available" />
                </Card>
            </section>
        );
    }

    return (
        <section aria-label="Average onboard time">
            <Card className="relative p-6">
                <span className="absolute right-4 top-4 rounded-full bg-primary-soft px-3 py-0.5 text-xs font-medium text-primary">
                    Avg.
                </span>

                <div className="flex flex-col items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-border">
                        <Clock size={20} className="text-primary" />
                    </div>

                    <div>
                        <p className="text-3xl font-bold text-text-primary">{avgDays} Days</p>
                        <p className="mt-1 text-sm text-text-secondary">Time to Onboard</p>
                    </div>
                </div>
            </Card>
        </section>
    );
}
