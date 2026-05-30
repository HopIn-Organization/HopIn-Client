import { Project, ProjectStatistics, UpsertProjectPayload } from "@/types/project";
import { ProjectMember } from "@/types/projectMember";

export interface ProjectsGateway {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  createProject(payload: UpsertProjectPayload): Promise<Project>;
  updateProject(
    payload: {
      id: string;
    } & UpsertProjectPayload,
  ): Promise<Project>;
  getProjectStatistics(): Promise<ProjectStatistics[]>;
  updateMemberRole(projectId: string, memberId: string, role: string): Promise<ProjectMember>;
  removeMember(projectId: string, memberId: string): Promise<void>;
  addMember(
    projectId: string,
    memberId: string,
    jobId: string,
    role: string,
  ): Promise<ProjectMember>;
  deleteProject(id: string): Promise<void>;
}
