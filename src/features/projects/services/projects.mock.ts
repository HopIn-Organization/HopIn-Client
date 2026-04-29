import projectsData from "@/mocks/projects.json";
import statisticsData from "@/mocks/statistics.json";
import { mockDelay } from "@/services/mock-delay";
import { Project, ProjectStatistics } from "@/types/project";
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
      membersCount: 1,
    };

    if (payload.description) {
      newProject.description = payload.description;
    }

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
      description: payload.description,
      repositoryUrl: payload.repositoryUrl,
      job: payload.jobs,
    };

    projects[index] = updated;
    return updated;
  },
  async getProjectStatistics() {
    await mockDelay();
    return statistics;
  },
};
