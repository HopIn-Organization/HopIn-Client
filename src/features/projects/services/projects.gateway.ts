import { Job } from "@/types/job";
import { Project, ProjectStatistics } from "@/types/project";

export interface ProjectsGateway {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  createProject(payload: {
    name: string;
    description?: string;
    repositoryUrl?: string;
    jobs?: Job[];
  }): Promise<Project>;
  getProjectStatistics(): Promise<ProjectStatistics[]>;
}
