import { Job } from "./job";
import type { User } from "./user";

export const ProjectMemberRoles = {
  ADMIN: "admin",
  TRAINEE: "trainee",
} as const;

export type ProjectMemberRole = (typeof ProjectMemberRoles)[keyof typeof ProjectMemberRoles];

export interface ProjectMember {
  id: number;
  user: User;
  projectId: string;
  role: ProjectMemberRole;
  job: Job;
  progress?: number;
}

export type FullProjectMember = ProjectMember & {
  progress: number;
};
