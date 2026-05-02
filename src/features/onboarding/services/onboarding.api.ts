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
    type TaskData = { id: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; order: number; links: string[]; subtasks?: Array<{ id: number; order: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; links: string[] }> };
    const { data } = await apiClient.patch<{ task: TaskData }>(`/tasks/${taskId}/complete`);
    const { task } = data;
    return { ...task, subtasks: task.subtasks ?? [] } as PlanTask;
  },
  async upsertTask(payload: UpsertTaskPayload) {
    type TaskData = { id: number; order: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; links: string[]; subtasks?: Array<{ id: number; order: number; title: string; description: string; estimatedDays: number; isCompleted: boolean; links: string[] }> };
    const { data } = await apiClient.put<{ task: TaskData }>('/tasks', payload);
    const { task } = data;
    return { ...task, subtasks: task.subtasks ?? [] } as PlanTask;
  },
  async deleteTask(taskId: number) {
    await apiClient.delete(`/tasks/${taskId}`);
  },
};
