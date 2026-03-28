import { Project, ProjectStatistics } from "@/types/project";

export interface ProjectsGateway {
  getProjects(): Promise<Project[]>;
  createProject(payload: {
    name: string;
    description: string;
    repositoryUrl?: string;
    roleTitle?: string;
    technologies?: string[];
  }): Promise<Project>;
  getProjectStatistics(): Promise<ProjectStatistics[]>;
}
