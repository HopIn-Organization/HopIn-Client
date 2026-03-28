import { EmployeeProfile } from "@/types/user";
import { OnboardingPlan, TeamLeadRequirement } from "@/types/onboarding";

export interface AiGateway {
  generatePlan(input: {
    employee: EmployeeProfile;
    requirement: TeamLeadRequirement;
  }): Promise<OnboardingPlan>;
}
