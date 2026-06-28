import usersData from "@/mocks/users.json";
import { useAuthStore } from "@/store/auth.store";
import { ProjectMember, ProjectMemberRole } from "@/types/projectMember";

type RawMembership = { projectId: string | number; role: string };
type RawUser = { email: string; projectMemberships: RawMembership[] };

export function useProjectRole(
  projectId: number | undefined,
  projectMembers?: ProjectMember[],
): ProjectMemberRole | null {
  const currentUserEmail = useAuthStore((state) => state.currentUserEmail);

  if (!currentUserEmail) return null;

  if (projectMembers) {
    return (
      projectMembers.find((m) => m.user.email === currentUserEmail.toLowerCase())?.role ?? null
    );
  }

  const user = (usersData as RawUser[]).find((u) => u.email === currentUserEmail);
  return (
    (user?.projectMemberships.find((m) => Number(m.projectId) === projectId)?.role as
      | ProjectMemberRole
      | undefined) ?? null
  );
}
