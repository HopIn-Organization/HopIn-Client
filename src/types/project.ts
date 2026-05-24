import { Job } from "./job";
import { ProjectMember } from "./projectMember";
import { Skill } from "./skill";

export interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  job?: Job[];
  jobs?: Job[];
  members?: ProjectMember[];
}

export interface UpsertProjectPayload {
  name: string;
  description?: string;
  repositoryUrl?: string;
  jobs?: Array<{ id?: number; title: string; skills?: Skill[] }>;
  members?: Array<{ userId: number; jobId?: number; role?: string }>;
}

export interface ProjectStatistics {
  projectId: string;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}
