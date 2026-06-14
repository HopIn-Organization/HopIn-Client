export const projectKeys = {
  all: ["projects"] as const,

  byId: (id: string) => ["projects", id] as const,

  statistics: () => ["project-statistics"] as const,

  detailedStatistics: (projectId: string) => ["project-detailed-statistics", projectId] as const,
};
