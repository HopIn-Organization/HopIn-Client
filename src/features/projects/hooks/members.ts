import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "../services/projects.service";
import { projectKeys } from "./projectKeys";
import { ProjectMember, ProjectMemberRole } from "@/types/projectMember";
import { Project } from "@/types/project";

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      role,
    }: {
      projectId: number;
      memberId: string;
      role: ProjectMemberRole;
    }) => projectsService.updateMemberRole(projectId, memberId, role),
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(projectKeys.byId(variables.projectId), (old: Project) => {
        if (!old) return old;

        return {
          ...old,
          members: old.members?.map((member: ProjectMember) =>
            member.id === Number(variables.memberId) ? { ...member, role: variables.role } : member,
          ),
        };
      });
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: number; memberId: string }) =>
      projectsService.removeMember(projectId, memberId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.byId(variables.projectId),
      });
    },
  });
}

export function useAddMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      memberId,
      jobId,
      role,
    }: {
      projectId: number;
      memberId: string;
      jobId: string;
      role: string;
    }) => projectsService.addMember(projectId, memberId, jobId, role),

    onSuccess: (_newMember, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.byId(variables.projectId),
      });
    },
  });
}
