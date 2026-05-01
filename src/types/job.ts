import { Skill } from "./skill";

export interface Job {
  id?: number;
  title: string;
  skills: Skill[];
  projectId?: string;
}
