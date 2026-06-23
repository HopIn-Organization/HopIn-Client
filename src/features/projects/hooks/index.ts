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

export function useDetailedStatisticsQuery(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detailedStatistics(projectId),
    queryFn: () => projectsService.getDetailedStatistics(projectId),
    enabled: Boolean(projectId),
    retry: false,
    staleTime: 30000,
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: projectKeys.byId(id) });
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
