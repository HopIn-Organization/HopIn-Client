import { env } from "@/utils/env";
import { onboardingApiGateway } from "./onboarding.api";
import { onboardingMockGateway } from "./onboarding.mock";

const gateway = env.dataSource === "api" ? onboardingApiGateway : onboardingMockGateway;

export const onboardingService = {
  getEmployeeProfiles: () => gateway.getEmployeeProfiles(),
  saveEmployeeProfile: (profile: Parameters<typeof gateway.saveEmployeeProfile>[0]) =>
    gateway.saveEmployeeProfile(profile),
  getTeamLeadRequirements: () => gateway.getTeamLeadRequirements(),
  saveTeamLeadRequirement: (requirement: Parameters<typeof gateway.saveTeamLeadRequirement>[0]) =>
    gateway.saveTeamLeadRequirement(requirement),
  getOnboardingPlans: () => gateway.getOnboardingPlans(),
  getOnboardingPlansByProject: (projectId: string) => gateway.getOnboardingPlansByProject(projectId),
  getOnboardingPlanById: (planId: number) => gateway.getOnboardingPlanById(planId),
  completeTask: (taskId: number) => gateway.completeTask(taskId),
};
