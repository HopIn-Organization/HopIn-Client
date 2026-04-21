import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/services/projects.service";
import { ProjectMember, ProjectMemberRole } from "@/types/projectMember";
import { Project } from "@/types/project";
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

export function useProjectStatisticsQuery() {
  return useQuery({
    queryKey: projectKeys.statistics(),
    queryFn: projectsService.getProjectStatistics,
  });
}

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      role,
    }: {
      projectId: string;
      memberId: string;
      role: ProjectMemberRole;
    }) => projectsService.updateMemberRole(projectId, memberId, role),
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        projectKeys.byId(JSON.stringify(variables.projectId)),
        (old: Project) => {
          if (!old) return old;

          return {
            ...old,
            members: old.members?.map((member: ProjectMember) =>
              member.id === Number(variables.memberId)
                ? { ...member, role: variables.role }
                : member,
            ),
          };
        },
      );
    },
  });
}
