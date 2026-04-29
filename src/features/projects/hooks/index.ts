import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/services/projects.service";
import { projectKeys } from "./projectKeys";

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: projectsService.getProjects,
  });
}

export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: projectKeys.byId(id),
    queryFn: () => projectsService.getProjectById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.updateProject,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
      await queryClient.invalidateQueries({ queryKey: projectKeys.byId(data.id) });
    },
  });
}

export function useProjectStatisticsQuery() {
  return useQuery({
    queryKey: projectKeys.statistics(),
    queryFn: projectsService.getProjectStatistics,
  });
}
