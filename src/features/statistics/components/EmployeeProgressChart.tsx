import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Card } from "@/ui/Card";
import { EmployeeProgress } from "@/types/project";
import { usePagination } from "../hooks/usePagination";
import { PaginationDots } from "./PaginationDots";
import { StatisticsEmptyState } from "./StatisticsEmptyState";

const PAGE_SIZE = 8;
const CHART_HEIGHT = 180;
const PLANNED_COLOR = "#9CA3AF"; // gray-400
const ACTUAL_COLOR = "#F87171"; // primary red

interface EmployeeProgressChartProps {
    data: EmployeeProgress[];
}

export function EmployeeProgressChart({ data }: EmployeeProgressChartProps) {
    const { pageItems, currentPage, totalPages, goNext, goPrev } = usePagination(data, PAGE_SIZE);

    // Compute consistent Y-axis max from ALL data, not just current page
    const yAxisMax = useMemo(() => {
        if (data.length === 0) return 0;
        return Math.max(...data.map((d) => Math.max(d.planned, d.actual)));
    }, [data]);

    if (data.length === 0) {
        return (
            <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-text-primary">Employee Progress</h3>
                <StatisticsEmptyState message="No employee progress data" />
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Employee Progress</h3>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <BarChart data={pageItems} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[0, yAxisMax]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Legend
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                        dataKey="planned"
                        name="Planned"
                        fill={PLANNED_COLOR}
                        radius={[3, 3, 0, 0]}
                    />
                    <Bar
                        dataKey="actual"
                        name="Actual"
                        fill={ACTUAL_COLOR}
                        radius={[3, 3, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            {totalPages > 1 && (
                <PaginationDots
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevious={goPrev}
                    onNext={goNext}
                />
            )}
        </Card>
    );
}
