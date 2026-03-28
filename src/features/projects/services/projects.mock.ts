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
  async createProject(payload) {
    await mockDelay();

    const newProject: Project = {
      id: `p_${projects.length + 1}`,
      name: payload.name,
      description: payload.description,
      membersCount: 1,
      role: "Admin",
    };

    projects.unshift(newProject);
    return newProject;
  },
  async getProjectStatistics() {
    await mockDelay();
    return statistics;
  },
};
