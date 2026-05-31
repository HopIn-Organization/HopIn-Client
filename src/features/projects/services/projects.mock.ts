import projectsData from "@/mocks/projects.json";
import statisticsData from "@/mocks/statistics.json";
import { mockDelay } from "@/services/mock-delay";
import { Project, ProjectStatistics } from "@/types/project";
import { ProjectMember } from "@/types/projectMember";
import { ProjectsGateway } from "./projects.gateway";

const projects = projectsData as Project[];
const statistics = statisticsData as ProjectStatistics[];

export const projectsMockGateway: ProjectsGateway = {
  async getProjects() {
    await mockDelay();
    return projects;
  },
  async getProjectById(id: string) {
    await mockDelay();

    const project = projects.find((item) => item.id === id);

    if (!project) {
      throw new Error(`Project ${id} not found`);
    }

    return project;
  },
  async createProject(payload) {
    await mockDelay();

    const newProject: Project = {
      id: `p_${projects.length + 1}`,
      name: payload.name,
      ...(payload.description !== undefined && { description: payload.description }),
    };

    projects.unshift(newProject);
    return newProject;
  },
  async updateProject(payload) {
    await mockDelay();

    const index = projects.findIndex((p) => p.id === payload.id);

    if (index === -1) {
      throw new Error(`Project ${payload.id} not found`);
    }

    const updated: Project = {
      ...projects[index]!,
      name: payload.name,
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.repositoryUrl !== undefined && { repositoryUrl: payload.repositoryUrl }),
      ...(payload.jobs !== undefined && { job: payload.jobs }),
    };

    projects[index] = updated;
    return updated;
  },
  async getProjectStatistics() {
    await mockDelay();
    return statistics;
  },
  async deleteProject(id: string) {
    await mockDelay();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project ${id} not found`);
    projects.splice(index, 1);
  },
  async updateMemberRole(projectId: string, memberId: string, role: string): Promise<ProjectMember> {
    void projectId; void memberId; void role;
    await mockDelay();
    throw new Error("updateMemberRole not implemented in mock");
  },
  async removeMember(projectId: string, memberId: string): Promise<void> {
    void projectId; void memberId;
    await mockDelay();
  },
  async addMember(projectId: string, memberId: string, jobId: string, role: string): Promise<ProjectMember> {
    void projectId; void memberId; void jobId; void role;
    await mockDelay();
    throw new Error("addMember not implemented in mock");
  },
};
