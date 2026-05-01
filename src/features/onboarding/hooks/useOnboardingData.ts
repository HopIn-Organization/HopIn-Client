import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/features/onboarding/services/ai.service";
import { onboardingService } from "@/features/onboarding/services/onboarding.service";

export function useOnboardingPlansQuery() {
  return useQuery({
    queryKey: ["onboarding-plans"],
    queryFn: onboardingService.getOnboardingPlans,
  });
}

export function useOnboardingPlansByProjectQuery(projectId: string) {
  return useQuery({
    queryKey: ["onboarding-plans", "project", projectId],
    queryFn: () => onboardingService.getOnboardingPlansByProject(projectId),
    enabled: !!projectId,
  });
}

export function useOnboardingPlanQuery(planId: number | undefined) {
  return useQuery({
    queryKey: ["onboarding-plans", planId],
    queryFn: () => onboardingService.getOnboardingPlanById(planId!),
    enabled: planId != null,
  });
}

export function useEmployeeProfilesQuery() {
  return useQuery({
    queryKey: ["employee-profiles"],
    queryFn: onboardingService.getEmployeeProfiles,
  });
}

export function useSaveEmployeeProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingService.saveEmployeeProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employee-profiles"] });
    },
  });
}

export function useTeamLeadRequirementsQuery() {
  return useQuery({
    queryKey: ["team-lead-requirements"],
    queryFn: onboardingService.getTeamLeadRequirements,
  });
}

export function useSaveTeamLeadRequirementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingService.saveTeamLeadRequirement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["team-lead-requirements"] });
    },
  });
}

export function useGeneratePlanMutation() {
  return useMutation({
    mutationFn: aiService.generatePlan,
  });
}

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingService.completeTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["onboarding-plans"] });
    },
  });
}

export function useUpsertTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingService.upsertTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["onboarding-plans"] });
    },
  });
}
