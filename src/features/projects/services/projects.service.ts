import { env } from "@/utils/env";
import { projectsApiGateway } from "./projects.api";
import { projectsMockGateway } from "./projects.mock";

const gateway = env.dataSource === "api" ? projectsApiGateway : projectsMockGateway;

export const projectsService = {
  getProjects: () => gateway.getProjects(),
  getProjectById: (id: number) => gateway.getProjectById(id),
  createProject: (payload: Parameters<typeof gateway.createProject>[0]) =>
    gateway.createProject(payload),
  updateProject: (payload: Parameters<typeof gateway.updateProject>[0]) =>
    gateway.updateProject(payload),
  getProjectStatistics: () => gateway.getProjectStatistics(),
  getDetailedStatistics: (projectId: number) => gateway.getDetailedStatistics(projectId),
  updateMemberRole: (projectId: number, memberId: string, role: string) =>
    gateway.updateMemberRole(projectId, memberId, role),
  removeMember: (projectId: number, memberId: string) => gateway.removeMember(projectId, memberId),
  addMember: (projectId: number, memberId: string, jobId: string, role: string) =>
    gateway.addMember(projectId, memberId, jobId, role),
  deleteProject: (id: number) => gateway.deleteProject(id),
};
