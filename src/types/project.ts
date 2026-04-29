import { Job } from "./job";
import { ProjectMember } from "./projectMember";

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  job?: Job[];
  jobs?: Job[];
  members?: ProjectMember[];
}

export interface ProjectStatistics {
  projectId: string;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}
