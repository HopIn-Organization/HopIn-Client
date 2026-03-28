import { apiClient } from "@/services/http/api-client";
import { OnboardingPlan } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiApiGateway: AiGateway = {
  async generatePlan(input) {
    const { data } = await apiClient.post<OnboardingPlan>('/onboarding/generate-plan', input);
    return data;
  },
};
