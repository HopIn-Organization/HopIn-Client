import { apiClient } from "@/services/http/api-client";
import { Project, ProjectStatistics, DetailedProjectStatistics } from "@/types/project";
import { ProjectsGateway } from "./projects.gateway";
import { ProjectMemberRole } from "@/types/projectMember";

export const projectsApiGateway: ProjectsGateway = {
  async getProjects() {
    const { data } = await apiClient.get<Project[]>("/projects");
    return data;
  },
  async getProjectById(id: number) {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },
  async createProject(payload) {
    const { data } = await apiClient.post<Project>("/projects", payload);
    return data;
  },
  async updateProject(payload) {
    const { data } = await apiClient.put<Project>(`/projects/${payload.id}`, payload);
    return data;
  },
  async getProjectStatistics() {
    const { data } = await apiClient.get<ProjectStatistics[]>("/projects/statistics");
    return data;
  },
  async getDetailedStatistics(projectId: number) {
    const { data } = await apiClient.get<DetailedProjectStatistics>(
      `/projects/${projectId}/statistics/detailed`,
    );
    return data;
  },
  async updateMemberRole(projectId: number, memberId: string, role: ProjectMemberRole) {
    const { data } = await apiClient.patch(`/projects/${projectId}/members/${memberId}/role`, {
      role,
    });

    return data;
  },
  async removeMember(projectId: number, memberId: string) {
    const { data } = await apiClient.delete(`/projects/${projectId}/members/${memberId}`);

    return data;
  },
  async addMember(projectId: number, memberId: string, jobId: string, role: string) {
    const { data } = await apiClient.post(`/projects/${projectId}/members`, {
      userId: Number(memberId),
      jobId: Number(jobId),
      role,
    });

    return data;
  },
  async deleteProject(id: number) {
    await apiClient.delete(`/projects/${id}`);
  },
};
