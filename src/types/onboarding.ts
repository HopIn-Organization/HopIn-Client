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
  id: string;
  employeeName: string;
  trackName: string;
  progressPercent: number;
  tasks: PlanTask[];
}
