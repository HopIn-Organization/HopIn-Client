import { EmployeeProfile } from "@/types/user";
import { OnboardingPlan, PlanTask, TeamLeadRequirement, UpsertTaskPayload } from "@/types/onboarding";

export interface OnboardingGateway {
  getEmployeeProfiles(): Promise<EmployeeProfile[]>;
  saveEmployeeProfile(profile: EmployeeProfile): Promise<EmployeeProfile>;
  getTeamLeadRequirements(): Promise<TeamLeadRequirement[]>;
  saveTeamLeadRequirement(requirement: TeamLeadRequirement): Promise<TeamLeadRequirement>;
  getOnboardingPlans(): Promise<OnboardingPlan[]>;
  getOnboardingPlansByProject(projectId: string): Promise<OnboardingPlan[]>;
  getOnboardingPlanById(planId: number): Promise<OnboardingPlan>;
  completeTask(taskId: number): Promise<PlanTask>;
  upsertTask(payload: UpsertTaskPayload): Promise<PlanTask>;
}
