import { Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/ui/Card";
import { useDetailedStatisticsQuery } from "@/features/projects/hooks";
import type { DetailedProjectStatistics } from "@/types/project";

interface ProjectStatisticsTabProps {
  projectId: string;
}

export function ProjectStatisticsTab({ projectId }: ProjectStatisticsTabProps) {
  const { data, isLoading } = useDetailedStatisticsQuery(projectId);

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading statistics...</p>;
  }

  if (!data) {
    return <p className="text-sm text-text-secondary">No statistics available for this project.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Top row: Avg Onboard Time | Slowest Tasks | Overdue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AvgOnboardCard avgDays={data.avgOnboardDays} />
        <SlowestTasksCard tasks={data.slowestTasks} />
        <OverdueCard count={data.overdueCount} members={data.overdueMembers} />
      </div>

      {/* Bottom row: Employee Progress | Job Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeProgressCard employees={data.employeeProgress} />
        <JobDistributionCard distribution={data.jobDistribution} />
      </div>
    </div>
  );
}

function AvgOnboardCard({ avgDays }: { avgDays: number }) {
  return (
    <Card className="flex flex-col items-start p-6">
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-warning text-warning">
          <Clock size={20} />
        </div>
        <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
          Avg.
        </span>
      </div>
      <p className="text-4xl font-bold text-text-primary">{avgDays} Days</p>
      <p className="mt-1 text-sm text-text-secondary">Time to Onboard</p>
    </Card>
  );
}

function SlowestTasksCard({ tasks }: { tasks: DetailedProjectStatistics["slowestTasks"] }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-text-primary">Slowest Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-text-secondary">{task.name}</span>
            <div className="relative h-3 flex-1 rounded-full bg-surface-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${task.percentage}%`, backgroundColor: task.color }}
              />
            </div>
            <span className="shrink-0 text-sm font-medium" style={{ color: task.color }}>
              {task.duration}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OverdueCard({
  count,
  members,
}: {
  count: number;
  members: DetailedProjectStatistics["overdueMembers"];
}) {
  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-danger/10 text-danger">
          <AlertTriangle size={18} />
        </div>
        <span className="text-3xl font-bold text-text-primary">{count} Overdue</span>
      </div>
      {members.length > 0 && (
        <div className="mt-3 flex items-center gap-4">
          {members.map((member) => (
            <div key={member.initials} className="flex flex-col items-center gap-1">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-sm font-semibold text-text-primary">
                {member.initials}
              </div>
              <span className="text-xs font-medium text-danger">{member.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function EmployeeProgressCard({
  employees,
}: {
  employees: DetailedProjectStatistics["employeeProgress"];
}) {
  const maxValue = Math.max(...employees.flatMap((e) => [e.planned, e.actual]));
  const yTicks = getYTicks(maxValue);
  const chartHeight = 180;

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold text-text-primary">Employee Progress</h3>
      <div className="flex items-end gap-2">
        {/* Y-axis labels */}
        <div className="flex h-[180px] flex-col justify-between pb-1 text-right">
          {yTicks
            .slice()
            .reverse()
            .map((tick) => (
              <span key={tick} className="text-xs text-text-secondary">
                {tick}
              </span>
            ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end justify-around">
          {employees.map((emp) => (
            <div key={emp.name} className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-1">
                <div
                  className="w-7 rounded-t-md bg-gray-300"
                  style={{ height: `${(emp.planned / maxValue) * chartHeight}px` }}
                  title={`Planned: ${emp.planned}`}
                />
                <div
                  className="w-7 rounded-t-md bg-primary"
                  style={{ height: `${(emp.actual / maxValue) * chartHeight}px` }}
                  title={`Actual: ${emp.actual}`}
                />
              </div>
              <span className="text-xs text-text-secondary">{emp.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-block h-3 w-3 rounded-sm bg-gray-300" />
          Planned
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
          Actual
        </span>
      </div>
    </Card>
  );
}

function JobDistributionCard({
  distribution,
}: {
  distribution: DetailedProjectStatistics["jobDistribution"];
}) {
  const total = distribution.reduce((sum, d) => sum + d.value, 0);

  // Build donut chart segments
  let cumulative = 0;
  const segments = distribution.map((d) => {
    const start = cumulative;
    const percent = (d.value / total) * 100;
    cumulative += percent;
    return { ...d, start, percent };
  });

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold text-text-primary">Job Distribution</h3>
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-48 w-48">
          {segments.map((seg) => (
            <DonutSegment
              key={seg.label}
              cx={100}
              cy={100}
              radius={70}
              strokeWidth={30}
              startPercent={seg.start}
              percent={seg.percent}
              color={seg.color}
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {distribution.map((d) => (
          <span key={d.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.label}
          </span>
        ))}
      </div>
    </Card>
  );
}

/* ---- Helpers ---- */

function getYTicks(max: number): number[] {
  const step = Math.ceil(max / 4 / 7) * 7;
  return [0, step, step * 2, step * 3, step * 4];
}

function DonutSegment({
  cx,
  cy,
  radius,
  strokeWidth,
  startPercent,
  percent,
  color,
}: {
  cx: number;
  cy: number;
  radius: number;
  strokeWidth: number;
  startPercent: number;
  percent: number;
  color: string;
}) {
  const circumference = 2 * Math.PI * radius;
  const offset = (circumference * startPercent) / 100;
  const length = (circumference * percent) / 100;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${length} ${circumference - length}`}
      strokeDashoffset={-offset}
      transform={`rotate(-90 ${cx} ${cy})`}
    />
  );
}
