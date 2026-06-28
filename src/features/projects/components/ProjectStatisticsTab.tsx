import { useDetailedStatisticsQuery } from "@/features/projects/hooks";
import { OverdueCard } from "@/features/statistics/components/OverdueCard";
import { JobAvgOnboardChart } from "@/features/statistics/components/JobAvgOnboardChart";
import { EmployeeProgressChart } from "@/features/statistics/components/EmployeeProgressChart";
import { JobDistributionChart } from "@/features/statistics/components/JobDistributionChart";
import { StatisticsSkeleton } from "@/features/statistics/components/StatisticsSkeleton";
import { StatisticsError } from "@/features/statistics/components/StatisticsError";

interface ProjectStatisticsTabProps {
  projectId: number;
}

export function ProjectStatisticsTab({ projectId }: ProjectStatisticsTabProps) {
  const { data, isLoading, isError, refetch } = useDetailedStatisticsQuery(projectId);

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  if (isError) {
    return <StatisticsError onRetry={() => void refetch()} />;
  }

  if (!data) {
    return (
      <StatisticsError
        message="No statistics available for this project."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top row: Per-Job Avg Onboard Time | Overdue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JobAvgOnboardChart data={data.avgOnboardDaysByJob ?? []} />
        <OverdueCard overdueCount={data.overdueCount} overdueMembers={data.overdueMembers} />
      </div>

      {/* Bottom row: Employee Progress | Job Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeProgressChart data={data.employeeProgress ?? []} />
        <JobDistributionChart data={data.jobDistribution ?? []} />
      </div>
    </div>
  );
}
