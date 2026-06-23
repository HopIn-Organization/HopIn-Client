import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/ui/Card";
import { StatisticsEmptyState } from "./StatisticsEmptyState";
import { AvgOnboardByJob } from "@/types/project";

interface JobAvgOnboardChartProps {
    data: AvgOnboardByJob[];
}

const COLLAPSED_LIMIT = 6;
const LABEL_MAX_LENGTH = 24;
const BAR_COLOR = "#6366F1";

function truncateLabel(label: string): string {
    if (label.length <= LABEL_MAX_LENGTH) return label;
    return label.slice(0, LABEL_MAX_LENGTH) + "…";
}

export function JobAvgOnboardChart({ data }: JobAvgOnboardChartProps) {
    const [expanded, setExpanded] = useState(false);

    if (data.length === 0) {
        return (
            <Card className="p-6" aria-label="Average onboard time by job role">
                <h3 className="mb-4 text-lg font-semibold text-text-primary">
                    Avg. Onboard Time by Role
                </h3>
                <StatisticsEmptyState message="No job roles configured" />
            </Card>
        );
    }

    const sorted = [...data].sort((a, b) => b.avgDays - a.avgDays);
    const showToggle = sorted.length > COLLAPSED_LIMIT;
    const visibleData = expanded ? sorted : sorted.slice(0, COLLAPSED_LIMIT);
    const maxDays = Math.max(...sorted.map((d) => d.avgDays));

    const chartHeight = visibleData.length * 44 + 16;

    return (
        <Card className="p-6" aria-label="Average onboard time by job role">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
                Avg. Onboard Time by Role
            </h3>

            <div style={{ width: "100%", height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={visibleData}
                        margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                    >
                        <XAxis
                            type="number"
                            domain={[0, maxDays || 1]}
                            hide
                        />
                        <YAxis
                            type="category"
                            dataKey="jobTitle"
                            width={140}
                            tickFormatter={truncateLabel}
                            tick={{ fontSize: 13, fill: "#6B7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Bar
                            dataKey="avgDays"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                            label={({ value, x, y, width, height }) => {
                                if (value === 0) {
                                    return (
                                        <text
                                            x={(x as number) + 8}
                                            y={(y as number) + (height as number) / 2}
                                            dominantBaseline="middle"
                                            fontSize={12}
                                            fill="#9CA3AF"
                                        >
                                            N/A
                                        </text>
                                    );
                                }
                                return (
                                    <text
                                        x={(x as number) + (width as number) + 8}
                                        y={(y as number) + (height as number) / 2}
                                        dominantBaseline="middle"
                                        fontSize={12}
                                        fill="#374151"
                                    >
                                        {Math.round(value as number)}
                                    </text>
                                );
                            }}
                        >
                            {visibleData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.avgDays === 0 ? "transparent" : BAR_COLOR}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {showToggle && (
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </Card>
    );
}
