import { Job } from "@/types/job";
import { Project, ProjectStatistics } from "@/types/project";
import { ProjectMember } from "@/types/projectMember";

export interface ProjectsGateway {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  createProject(payload: {
    name: string;
    description?: string;
    repositoryUrl?: string;
    jobs?: Job[];
  }): Promise<Project>;
    updateProject(payload: {
    id: string;
    name: string;
    description?: string;
    repositoryUrl?: string;
    jobs?: Job[];
  }): Promise<Project>;
  getProjectStatistics(): Promise<ProjectStatistics[]>;
  updateMemberRole(projectId: string, memberId: string, role: string): Promise<ProjectMember>;
  removeMember(memberId: string): Promise<void>;
}
