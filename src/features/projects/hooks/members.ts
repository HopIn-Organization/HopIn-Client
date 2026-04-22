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

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      projectsService.removeMember(projectId, memberId),

    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        projectKeys.byId(variables.projectId),
        (old: Project | undefined) => {
          if (!old) return old;

          return {
            ...old,
            members: old.members?.filter(
              (member: ProjectMember) => member.id !== Number(variables.memberId),
            ),
          };
        },
      );
    },
  });
}
