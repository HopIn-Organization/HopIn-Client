import { Skill } from "./skill";

export interface Job {
  title: string;
  skills: Skill[];
  projectId?: string;
}
