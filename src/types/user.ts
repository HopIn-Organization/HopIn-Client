import { Skill } from "./skill";

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

export interface User {
  id: number;
  name: string;
  email: string | null;
  experienceYears: number | null;
  skills: Skill[];
  projectMemberships: ProjectMember[];
}

export interface EmployeeProfile {
  userId: string;
  background: string;
  yearsInTech: number;
  knownTechnologies: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced";
  }>;
}
