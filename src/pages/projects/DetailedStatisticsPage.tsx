import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDetailedStatisticsQuery, useProjectQuery } from "@/features/projects/hooks";
import { StatisticsSkeleton } from "@/features/statistics/components/StatisticsSkeleton";
import { StatisticsError } from "@/features/statistics/components/StatisticsError";
import { OverdueCard } from "@/features/statistics/components/OverdueCard";
import { JobAvgOnboardChart } from "@/features/statistics/components/JobAvgOnboardChart";
import { EmployeeProgressChart } from "@/features/statistics/components/EmployeeProgressChart";
import { JobDistributionChart } from "@/features/statistics/components/JobDistributionChart";

export function DetailedStatisticsPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const { data, isLoading, isError, refetch } = useDetailedStatisticsQuery(projectId);
  const { data: project } = useProjectQuery(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-3">
          <Link
            to="/statistics"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Back to statistics"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-7 w-48 animate-pulse rounded-lg bg-surface-muted" />
        </header>
        <StatisticsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <header className="flex items-center gap-3">
          <Link
            to="/statistics"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Back to statistics"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">
            {project?.name ?? "Project Statistics"}
          </h1>
        </header>
        <StatisticsError onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          to="/statistics"
          className="grid h-8 w-8 place-items-center rounded-lg border border-border text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Back to statistics"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold text-text-primary">
          {project?.name ?? "Project Statistics"}
        </h1>
      </header>

      {/* Top row: Per-Job Avg Onboard Time | Overdue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JobAvgOnboardChart data={data?.avgOnboardDaysByJob ?? []} />
        <OverdueCard
          overdueCount={data?.overdueCount ?? 0}
          overdueMembers={data?.overdueMembers ?? []}
        />
      </div>

      {/* Bottom row: Employee Progress | Job Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeProgressChart data={data?.employeeProgress ?? []} />
        <JobDistributionChart data={data?.jobDistribution ?? []} />
      </div>
    </div>
  );
}
