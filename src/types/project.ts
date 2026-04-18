import { Job } from "./job";

export type ProjectRole = "Admin" | "Trainee";

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  job?: Job[];
}

export interface ProjectStatistics {
  projectId: string;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}
