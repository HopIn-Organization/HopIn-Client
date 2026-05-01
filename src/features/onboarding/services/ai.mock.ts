import { mockDelay } from "@/services/mock-delay";
import { OnboardingPlan } from "@/types/onboarding";
import { AiGateway } from "./ai.gateway";

export const aiMockGateway: AiGateway = {
  async generatePlan({ userId, jobId }) {
    await mockDelay(260);

    const generatedPlan: OnboardingPlan = {
      id: Date.now(),
      user: { id: userId, name: "", email: null, experienceYears: null },
      job: { id: jobId, title: "", skills: [] },
      project: { id: "1", name: "" },
      progress: 0,
      tasks: [
        {
          id: 1,
          title: "Learn core stack",
          description: "Go through docs and finish guided tutorials.",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Ship onboarding mini project",
          description: "Build and present a feature aligned with team standards.",
          isCompleted: false,
        },
      ],
    };

    return generatedPlan;
  },
};
