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

export interface SlowestTask {
  name: string;
  duration: string;
  /** 0–100 relative bar width */
  percentage: number;
  color: string;
}

export interface OverdueMember {
  initials: string;
  label: string;
}

export interface EmployeeProgress {
  name: string;
  planned: number;
  actual: number;
}

export interface JobDistribution {
  label: string;
  value: number;
  color: string;
}

export interface DetailedProjectStatistics {
  projectId: string;
  avgOnboardDays: number;
  slowestTasks: SlowestTask[];
  overdueCount: number;
  overdueMembers: OverdueMember[];
  employeeProgress: EmployeeProgress[];
  jobDistribution: JobDistribution[];
}
