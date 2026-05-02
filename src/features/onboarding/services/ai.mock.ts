import { mockDelay } from "@/services/mock-delay";
import { OnboardingStatus } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiMockGateway: AiGateway = {
  async generatePlan() {
    await mockDelay(260);
    return { onboardingId: 1 };
  },

  async getOnboardingStatus(onboardingId: number) {
    await mockDelay(260);
    return { id: onboardingId, status: 'ready' as OnboardingStatus, failureReason: null };
  },
};
