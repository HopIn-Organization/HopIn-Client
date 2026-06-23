import { useState } from "react";
import { AlertTriangle, CheckCircle, ChevronUp } from "lucide-react";
import { Card } from "@/ui/Card";
import { OverdueMember } from "@/types/project";

interface OverdueCardProps {
    overdueCount: number;
    overdueMembers: OverdueMember[];
}

const MAX_VISIBLE = 5;

export function OverdueCard({ overdueCount, overdueMembers }: OverdueCardProps) {
    const [expanded, setExpanded] = useState(false);

    const hasOverdue = overdueCount > 0 && overdueMembers.length > 0;
    const hasMore = overdueMembers.length > MAX_VISIBLE;
    const visibleMembers = expanded ? overdueMembers : overdueMembers.slice(0, MAX_VISIBLE);
    const remainingCount = overdueMembers.length - MAX_VISIBLE;

    return (
        <Card className="p-5" aria-label="Overdue members">
            <div className="mb-4 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-500">
                    <AlertTriangle size={16} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">Overdue</h3>
                {hasOverdue && (
                    <span className="ml-auto text-xs font-medium text-text-secondary">
                        {overdueCount} member{overdueCount !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {!hasOverdue ? (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-green-700">All members are on track</span>
                </div>
            ) : (
                <div>
                    <div
                        className={
                            expanded
                                ? "max-h-[240px] space-y-2 overflow-y-auto"
                                : "space-y-2"
                        }
                    >
                        {visibleMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                                    {member.initials}
                                </div>
                                <span className="text-sm text-text-secondary">{member.label}</span>
                            </div>
                        ))}
                    </div>

                    {hasMore && !expanded && (
                        <button
                            type="button"
                            onClick={() => setExpanded(true)}
                            className="mt-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary hover:bg-border transition-colors"
                        >
                            +{remainingCount} more
                        </button>
                    )}

                    {expanded && (
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ChevronUp size={14} />
                            Show less
                        </button>
                    )}
                </div>
            )}
        </Card>
    );
}
