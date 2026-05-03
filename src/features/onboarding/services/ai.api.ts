import { apiClient } from "@/services/http/api-client";
import { OnboardingStatusResult } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiApiGateway: AiGateway = {
  async generatePlan(payload) {
    const { data } = await apiClient.post<{ onboardingId: number }>('/onboarding/generate', payload);
    return { onboardingId: data.onboardingId };
  },

  async getOnboardingStatus(onboardingId: number) {
    const { data } = await apiClient.get<OnboardingStatusResult>(`/onboarding/${onboardingId}/status`);
    return data;
  },
};
