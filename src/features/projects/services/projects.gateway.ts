import {
  Project,
  ProjectStatistics,
  DetailedProjectStatistics,
  UpsertProjectPayload,
} from "@/types/project";
import { ProjectMember } from "@/types/projectMember";

export interface ProjectsGateway {
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project>;
  createProject(payload: UpsertProjectPayload): Promise<Project>;
  updateProject(
    payload: {
      id: number;
    } & UpsertProjectPayload,
  ): Promise<Project>;
  getProjectStatistics(): Promise<ProjectStatistics[]>;
  getDetailedStatistics(projectId: number): Promise<DetailedProjectStatistics>;
  updateMemberRole(projectId: number, memberId: string, role: string): Promise<ProjectMember>;
  removeMember(projectId: number, memberId: string): Promise<void>;
  addMember(
    projectId: number,
    memberId: string,
    jobId: string,
    role: string,
  ): Promise<ProjectMember>;
  deleteProject(id: number): Promise<void>;
}
