import { Skill } from "./skill";

export interface Job {
  id?: string;
  title: string;
  skills: Skill[];
  projectId?: string;
}
