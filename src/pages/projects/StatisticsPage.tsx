import { StatisticsCard } from "@/features/statistics/components/StatisticsCard";
import { useProjectStatisticsQuery, useProjectsQuery } from "@/features/projects/hooks";

export function StatisticsPage() {
  const { data: projects = [] } = useProjectsQuery();
  const { data: stats = [] } = useProjectStatisticsQuery();

  const cards = projects
    .map((project) => {
      const statistics = stats.find((entry) => entry.projectId === project.id);
      if (!statistics) return null;
      return { project, statistics };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-5xl font-semibold text-text-primary">Statistics</h1>
        <p className="mt-2 text-xl text-text-secondary">View detailed analytics for each project.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {cards.map((card) => (
          <StatisticsCard key={card.project.id} project={card.project} statistics={card.statistics} />
        ))}
      </div>
    </section>
  );
}
