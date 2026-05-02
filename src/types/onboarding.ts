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
  id: number;
  title: string;
  description: string;
  order: number; 
  estimatedDays: number;
  isCompleted: boolean;
  links?: Array<string>;
  subtasks?: Array<{ id: string; label: string; isCompleted: boolean }>;
}

export interface CreateTaskPayload {
  order: number;
  title: string;
  description: string;
  estimatedDays: number;
  isCompleted?: boolean;
  links?: string[];
  onboardingId: number;
  parentId?: number | null;
}

export interface UpdateTaskPayload {
  id: number;
  order?: number;
  title?: string;
  description?: string;
  estimatedDays?: number;
  isCompleted?: boolean;
  links?: string[];
  subtasks?: Array<{ id: string; label: string; isCompleted: boolean }>;
  onboardingId: number;
  parentId?: number | null;
}

export type UpsertTaskPayload = CreateTaskPayload | UpdateTaskPayload;

export interface OnboardingPlan {
  id: number;
  user: User;
  job: Job;
  project: Project;
  tasks: PlanTask[];
  progress: number;
}
