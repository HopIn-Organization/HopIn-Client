import { apiClient } from "@/services/http/api-client";
import { OnboardingPlan, PlanTask, TeamLeadRequirement, UpsertTaskPayload } from "@/types/onboarding";
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
  async getOnboardingPlansByProject(projectId: string) {
    const { data } = await apiClient.get<OnboardingPlan[]>(`/onboarding/project/${projectId}`);
    return data;
  },
  async getOnboardingPlanById(planId: number) {
    const { data } = await apiClient.get<OnboardingPlan>(`/onboarding/id/${planId}`);
    return data;
  },
  async completeTask(taskId: number) {
    const { data } = await apiClient.patch<{ task: { id: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; order: number } }>(`/tasks/${taskId}/complete`);
    const { task } = data;
    return { id: task.id, title: task.title, description: task.description, isCompleted: task.isCompleted };
  },
  async upsertTask(payload: UpsertTaskPayload) {
    const { data } = await apiClient.put<{ task: { id: number; order: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; links: string[] } }>('/tasks', payload);
    const { task } = data;
    return { id: task.id, title: task.title, description: task.description, isCompleted: task.isCompleted, links: task.links } as PlanTask;
  },
};
