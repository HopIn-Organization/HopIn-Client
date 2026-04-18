import type { User } from "./user";

export const ProjectMemberRoles = {
  ADMIN: "admin",
  TRAINEE: "trainee",
} as const;

export type ProjectMemberRole = (typeof ProjectMemberRoles)[keyof typeof ProjectMemberRoles];

export interface ProjectMember {
  id: number;
  projectId: string;
  role: ProjectMemberRole;
  progress?: number;
}

export type FullProjectMember = Omit<User, "projectMemberships"> &
  ProjectMember & {
    progress: number;
  };
