import employeeProfilesData from "@/mocks/employee-profiles.json";
import plansData from "@/mocks/onboarding-plans.json";
import teamLeadRequirementsData from "@/mocks/team-lead-requirements.json";
import { mockDelay } from "@/services/mock-delay";
import { OnboardingPlan, TeamLeadRequirement } from "@/types/onboarding";
import { EmployeeProfile } from "@/types/user";
import { OnboardingGateway } from "./onboarding.gateway";

const employeeProfiles = employeeProfilesData as EmployeeProfile[];
const teamLeadRequirements = teamLeadRequirementsData as TeamLeadRequirement[];
const onboardingPlans = plansData as OnboardingPlan[];

export const onboardingMockGateway: OnboardingGateway = {
  async getEmployeeProfiles() {
    await mockDelay();
    return employeeProfiles;
  },
  async saveEmployeeProfile(profile) {
    await mockDelay();

    const index = employeeProfiles.findIndex((item) => item.userId === profile.userId);
    if (index >= 0) {
      employeeProfiles[index] = profile;
      return profile;
    }

    employeeProfiles.push(profile);
    return profile;
  },
  async getTeamLeadRequirements() {
    await mockDelay();
    return teamLeadRequirements;
  },
  async saveTeamLeadRequirement(requirement) {
    await mockDelay();

    const index = teamLeadRequirements.findIndex((item) => item.id === requirement.id);
    if (index >= 0) {
      teamLeadRequirements[index] = requirement;
      return requirement;
    }

    teamLeadRequirements.push(requirement);
    return requirement;
  },
  async getOnboardingPlans() {
    await mockDelay();
    return onboardingPlans;
  },
};
