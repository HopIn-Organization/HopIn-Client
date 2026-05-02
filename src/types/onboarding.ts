import { Job } from "./job";
import { Project } from "./project";
import { User } from "./user";

export type OnboardingStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface OnboardingGenerationJob {
  onboardingId: number;
}

export interface OnboardingStatusResult {
  id: number;
  status: OnboardingStatus;
  failureReason?: string | null;
}

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
  subtasks?: Array<PlanTask>;
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
  subtasks?: Array<{ id?: number; title: string; description?: string; order?: number; estimatedDays?: number; isCompleted?: boolean }>;
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
