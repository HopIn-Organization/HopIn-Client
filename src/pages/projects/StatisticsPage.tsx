import { useNavigate } from "react-router-dom";
import { BarChart3, ArrowRight } from "lucide-react";
import { useProjectsQuery } from "@/features/projects/hooks";
import { Card } from "@/ui/Card";

export function StatisticsPage() {
  const { data: projects = [] } = useProjectsQuery();
  const navigate = useNavigate();

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-4xl font-semibold text-text-primary">Statistics</h1>
        <p className="mt-2 text-xl text-text-secondary">
          View detailed analytics for your projects.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No projects available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="p-7 shadow-soft">
              <div className="mb-8 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <BarChart3 size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/statistics/${project.id}`)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-surface-muted text-text-primary hover:bg-border transition-colors"
                  aria-label={`Open ${project.name} statistics`}
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              <h3 className="mb-3 text-[34px] font-semibold leading-tight text-text-primary md:text-3xl">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-text-secondary">{project.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
