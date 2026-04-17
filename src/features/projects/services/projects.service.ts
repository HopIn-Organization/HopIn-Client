import { env } from "@/utils/env";
import { projectsApiGateway } from "./projects.api";
import { projectsMockGateway } from "./projects.mock";

const gateway = env.dataSource === "api" ? projectsApiGateway : projectsMockGateway;

console.log(env.dataSource);

export const projectsService = {
  getProjects: () => gateway.getProjects(),
  getProjectById: (id: string) => gateway.getProjectById(id),
  createProject: (payload: Parameters<typeof gateway.createProject>[0]) =>
    gateway.createProject(payload),
  getProjectStatistics: () => gateway.getProjectStatistics(),
};
