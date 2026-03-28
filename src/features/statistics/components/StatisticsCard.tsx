import { ArrowRight, BarChart3 } from "lucide-react";
import { Project, ProjectStatistics } from "@/types/project";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface StatisticsCardProps {
  project: Project;
  statistics: ProjectStatistics;
}

export function StatisticsCard({ project, statistics }: StatisticsCardProps) {
  return (
    <Card className="p-7 shadow-soft">
      <div className="mb-8 flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <BarChart3 size={18} />
        </div>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-full bg-surface-muted text-text-primary"
          aria-label={`Open ${project.name} statistics`}
        >
          <ArrowRight size={14} />
        </button>
      </div>

      <h3 className="mb-7 text-[34px] font-semibold leading-tight text-text-primary md:text-3xl">{project.name}</h3>

      <div className="space-y-3 text-sm">
        <Row label="Team Members" value={String(statistics.teamMembers)} />
        <Row label="Avg Progress" value={`${statistics.averageProgress}%`} />
        <Row label="Completion Rate" value={`${statistics.completionRate}%`} accent />
      </div>

      <div className="my-7 h-px bg-border" />
      <Button variant="outline" className="w-full">
        View Detailed Statistics
      </Button>
    </Card>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <p className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className={accent ? "font-semibold text-success" : "font-semibold text-text-primary"}>{value}</span>
    </p>
  );
}
