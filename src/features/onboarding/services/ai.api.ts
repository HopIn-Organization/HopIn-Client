import { apiClient } from "@/services/http/api-client";
import { OnboardingPlan } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiApiGateway: AiGateway = {
  async generatePlan(payload) {
    const { data } = await apiClient.post<{ onBoarding: OnboardingPlan }>('/onboarding/generate', payload, { timeout: 120_000 });
    return data.onBoarding;
  },
};
