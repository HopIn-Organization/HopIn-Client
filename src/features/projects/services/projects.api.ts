import { apiClient } from "@/services/http/api-client";
import { Project, ProjectStatistics } from "@/types/project";
import { ProjectsGateway } from "./projects.gateway";
import { ProjectMemberRole } from "@/types/projectMember";

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
  async updateMemberRole(projectId: string, memberId: string, role: ProjectMemberRole) {
    const { data } = await apiClient.patch(`projects/${projectId}/members/${memberId}/role`, {
      role,
    });

    return data;
  },
  async removeMember(projectId: string, memberId: string) {
    const { data } = await apiClient.delete(`projects/${projectId}/members/${memberId}`);

    return data;
  },
};
