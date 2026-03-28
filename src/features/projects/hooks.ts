import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/services/projects.service";

export function useProjectsQuery() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useProjectStatisticsQuery() {
  return useQuery({
    queryKey: ["project-statistics"],
    queryFn: projectsService.getProjectStatistics,
  });
}
