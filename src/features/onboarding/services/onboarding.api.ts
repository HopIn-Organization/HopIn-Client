import { apiClient } from "@/services/http/api-client";
import { OnboardingPlan, TeamLeadRequirement } from "@/types/onboarding";
import { EmployeeProfile } from "@/types/user";
import { OnboardingGateway } from "./onboarding.gateway";

export const onboardingApiGateway: OnboardingGateway = {
  async getEmployeeProfiles() {
    const { data } = await apiClient.get<EmployeeProfile[]>('/employees/profiles');
    return data;
  },
  async saveEmployeeProfile(profile) {
    const { data } = await apiClient.post<EmployeeProfile>('/employees/profiles', profile);
    return data;
  },
  async getTeamLeadRequirements() {
    const { data } = await apiClient.get<TeamLeadRequirement[]>('/team-lead/requirements');
    return data;
  },
  async saveTeamLeadRequirement(requirement) {
    const { data } = await apiClient.post<TeamLeadRequirement>('/team-lead/requirements', requirement);
    return data;
  },
  async getOnboardingPlans() {
    const { data } = await apiClient.get<OnboardingPlan[]>('/onboarding/plans');
    return data;
  },
};
