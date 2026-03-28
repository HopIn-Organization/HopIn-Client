import { EmployeeProfile } from "@/types/user";
import { OnboardingPlan, TeamLeadRequirement } from "@/types/onboarding";

export interface OnboardingGateway {
  getEmployeeProfiles(): Promise<EmployeeProfile[]>;
  saveEmployeeProfile(profile: EmployeeProfile): Promise<EmployeeProfile>;
  getTeamLeadRequirements(): Promise<TeamLeadRequirement[]>;
  saveTeamLeadRequirement(requirement: TeamLeadRequirement): Promise<TeamLeadRequirement>;
  getOnboardingPlans(): Promise<OnboardingPlan[]>;
}
