import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, type TooltipProps } from "recharts";
import { Card } from "@/ui/Card";
import { JobDistribution } from "@/types/project";
import { groupJobDistribution } from "../utils/groupJobDistribution";
import { StatisticsEmptyState } from "./StatisticsEmptyState";

interface JobDistributionChartProps {
    data: JobDistribution[];
}

interface OtherTooltipProps extends TooltipProps<number, string> {
    originalData: JobDistribution[];
    groupedData: JobDistribution[];
}

function OtherSegmentTooltip({ active, payload, originalData, groupedData }: OtherTooltipProps) {
    if (!active || !payload || payload.length === 0) return null;

    const entry = payload[0];
    if (entry.name !== "Other") return null;

    // Find the roles grouped into "Other"
    const topLabels = new Set(groupedData.filter((d) => d.label !== "Other").map((d) => d.label));
    const otherRoles = originalData.filter((d) => !topLabels.has(d.label));

    return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-md">
            <p className="mb-1 text-xs font-semibold text-text-primary">Other roles</p>
            <ul className="space-y-0.5">
                {otherRoles.map((role) => (
                    <li key={role.label} className="flex items-center justify-between gap-4 text-xs text-text-secondary">
                        <span>{role.label}</span>
                        <span className="font-medium text-text-primary">{role.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function JobDistributionChart({ data }: JobDistributionChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return (
            <Card className="p-6">
                <h3 className="mb-4 text-base font-semibold text-text-primary">Job Distribution</h3>
                <StatisticsEmptyState message="No job distribution data" />
            </Card>
        );
    }

    const groupedData = groupJobDistribution(data);

    const handlePieEnter = (_: unknown, index: number) => {
        if (groupedData[index]?.label === "Other") {
            setActiveIndex(index);
        }
    };

    const handlePieLeave = () => {
        setActiveIndex(null);
    };

    const handlePieClick = (_: unknown, index: number) => {
        if (groupedData[index]?.label === "Other") {
            setActiveIndex((prev) => (prev === index ? null : index));
        }
    };

    return (
        <Card className="p-6">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Job Distribution</h3>
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                <div className="shrink-0">
                    <PieChart width={200} height={200}>
                        <Pie
                            data={groupedData}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            onMouseEnter={handlePieEnter}
                            onMouseLeave={handlePieLeave}
                            onClick={handlePieClick}
                        >
                            {groupedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" />
                            ))}
                        </Pie>
                        <Tooltip
                            active={activeIndex !== null}
                            content={<OtherSegmentTooltip originalData={data} groupedData={groupedData} />}
                        />
                    </PieChart>
                </div>

                <ul className="w-full space-y-2">
                    {groupedData.map((entry) => (
                        <li key={entry.label} className="flex items-center gap-2 text-sm">
                            <span
                                className="inline-block h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: entry.color }}
                                aria-hidden="true"
                            />
                            <span className="text-text-secondary">{entry.label}</span>
                            <span className="ml-auto font-medium text-text-primary">{entry.value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}
