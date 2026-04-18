import { Job } from "./job";

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  job?: Job[];
  membersCount?: number;
}

export interface ProjectStatistics {
  projectId: string;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}
