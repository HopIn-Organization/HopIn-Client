import { Job } from "./job";
import { ProjectMember } from "./projectMember";
import { Skill } from "./skill";

export interface Project {
  id: number;
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
  projectId: number;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}

export interface AvgOnboardByJob {
  jobTitle: string;
  avgDays: number;
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
  projectId: number;
  avgOnboardDaysByJob: AvgOnboardByJob[];
  overdueCount: number;
  overdueMembers: OverdueMember[];
  employeeProgress: EmployeeProgress[];
  jobDistribution: JobDistribution[];
}
