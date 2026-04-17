import { apiClient } from "@/services/http/api-client";
import { Project, ProjectStatistics } from "@/types/project";
import { ProjectsGateway } from "./projects.gateway";

export const projectsApiGateway: ProjectsGateway = {
  async getProjects() {
    const { data } = await apiClient.get<Project[]>("/projects");
    return data;
  },
  async getProjectById(id: string) {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },
  async createProject(payload) {
    const { data } = await apiClient.post<Project>("/projects", payload);
    return data;
  },
  async getProjectStatistics() {
    const { data } = await apiClient.get<ProjectStatistics[]>("/projects/statistics");
    return data;
  },
};
