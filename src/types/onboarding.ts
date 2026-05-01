import { Job } from "./job";
import { Project } from "./project";
import { User } from "./user";

export type TechLevel = "Beginner" | "Intermediate" | "Advanced";

export interface TeamLeadRequirement {
  id: string;
  projectId: string;
  roleTitle: string;
  desiredTechnologies: Array<{
    name: string;
    minimumLevel: TechLevel;
  }>;
  expectations: string;
}

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  links?: Array<{ label: string; url: string }>;
  subtasks?: Array<{ id: string; label: string; completed: boolean }>;
}

export interface OnboardingPlan {
  id: number;
  user: User;
  job: Job;
  project: Project;
  tasks: PlanTask[];
  progress: number;
}
