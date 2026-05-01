import employeeProfilesData from "@/mocks/employee-profiles.json";
import plansData from "@/mocks/onboarding-plans.json";
import teamLeadRequirementsData from "@/mocks/team-lead-requirements.json";
import { mockDelay } from "@/services/mock-delay";
import { OnboardingPlan, PlanTask, TeamLeadRequirement, UpsertTaskPayload } from "@/types/onboarding";
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
  async getOnboardingPlansByProject(projectId: string) {
    await mockDelay();
    return onboardingPlans.filter((p) => String(p.project.id) === String(projectId));
  },
  async getOnboardingPlanById(planId: number) {
    await mockDelay();
    const plan = onboardingPlans.find((p) => p.id === planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);
    return plan;
  },
  async completeTask(taskId: number) {
    await mockDelay();
    for (const plan of onboardingPlans) {
      const task = plan.tasks.find((t) => t.id === taskId);
      if (task) {
        task.isCompleted = true;
        return task;
      }
    }
    throw new Error(`Task ${taskId} not found`);
  },
  async upsertTask(payload: UpsertTaskPayload) {
    await mockDelay();
    if ("id" in payload) {
      for (const plan of onboardingPlans) {
        const idx = plan.tasks.findIndex((t) => t.id === payload.id);
        if (idx >= 0) {
          plan.tasks[idx] = { ...plan.tasks[idx], ...payload } as PlanTask;
          return plan.tasks[idx];
        }
      }
      throw new Error(`Task ${payload.id} not found`);
    }
    const plan = onboardingPlans.find((p) => p.id === payload.onboardingId);
    if (!plan) throw new Error(`Plan ${payload.onboardingId} not found`);
    const newTask: PlanTask = {
      id: Date.now(),
      title: payload.title,
      description: payload.description,
      isCompleted: payload.isCompleted ?? false,
      links: payload.links ?? [],
    };
    plan.tasks.push(newTask);
    return newTask;
  },
  async deleteTask(taskId: number) {
    await mockDelay();
    for (const plan of onboardingPlans) {
      const idx = plan.tasks.findIndex((t) => t.id === taskId);
      if (idx >= 0) {
        plan.tasks.splice(idx, 1);
        return;
      }
    }
    throw new Error(`Task ${taskId} not found`);
  },
};
