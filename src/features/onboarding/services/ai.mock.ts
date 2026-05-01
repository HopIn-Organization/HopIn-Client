import { mockDelay } from "@/services/mock-delay";
import { OnboardingPlan } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiMockGateway: AiGateway = {
  async generatePlan({ userId, jobId }) {
    await mockDelay(260);

    const generatedPlan: OnboardingPlan = {
      id: Date.now(),
      userId,
      jobId,
      projectId: 1,
      tasks: [
        {
          id: "gen_1",
          title: "Learn core stack",
          description: "Go through docs and finish guided tutorials.",
          completed: false,
        },
        {
          id: "gen_2",
          title: "Ship onboarding mini project",
          description: "Build and present a feature aligned with team standards.",
          completed: false,
        },
      ],
    };

    return generatedPlan;
  },
};
