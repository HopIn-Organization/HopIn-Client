import type { ProjectMember } from "./projectMember";
import type { Skill } from "./skill";

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
