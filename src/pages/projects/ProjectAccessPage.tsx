import usersData from "@/mocks/users.json";
import skillsData from "@/mocks/skills.json";
import { Navigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ProjectMemberRoles } from "@/types/projectMember";
import { Skill } from "@/types/skill";
import { User } from "@/types/user";
import { ProjectDetailsPage } from "./ProjectDetailsPage";

interface StoredUser extends Omit<User, "skills"> {
  skillIds: number[];
}

const skills = skillsData as Skill[];
const users = (usersData as StoredUser[]).map((user) => ({
  ...user,
  skills: user.skillIds
    .map((skillId) => skills.find((skill) => skill.id === skillId))
    .filter((skill): skill is Skill => Boolean(skill)),
}));

export function ProjectAccessPage() {
  const { projectId = "" } = useParams();
  const currentUserEmail = useAuthStore((state) => state.currentUserEmail);

  const currentUser = users.find((user) => user.email === currentUserEmail);
  const membership = currentUser?.projectMemberships.find(
    (projectMembership) => projectMembership.projectId === projectId,
  );

  if (membership?.role === ProjectMemberRoles.ADMIN) {
    return <ProjectDetailsPage />;
  }

  return <Navigate to="/onboarding/plan" replace />;
}
