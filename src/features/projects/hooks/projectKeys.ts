export const projectKeys = {
  all: ["projects"] as const,

  byId: (id: number | undefined) => ["projects", id] as const,

  statistics: () => ["project-statistics"] as const,

  detailedStatistics: (projectId: number | undefined) =>
    ["project-detailed-statistics", projectId] as const,
};
