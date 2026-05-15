import usersData from "@/mocks/users.json";
import { useAuthStore } from "@/store/auth.store";
import { ProjectMember, ProjectMemberRole } from "@/types/projectMember";

type RawMembership = { projectId: string; role: string };
type RawUser = { email: string; projectMemberships: RawMembership[] };

export function useProjectRole(projectId: string, projectMembers?: ProjectMember[]): ProjectMemberRole | null {
  const currentUserEmail = useAuthStore((state) => state.currentUserEmail);

  if (!currentUserEmail) return null;

  if (projectMembers) {
    return projectMembers.find((m) => m.user.email === currentUserEmail)?.role ?? null;
  }

  const user = (usersData as RawUser[]).find((u) => u.email === currentUserEmail);
  return (user?.projectMemberships.find((m) => m.projectId === projectId)?.role as ProjectMemberRole | undefined) ?? null;
}
