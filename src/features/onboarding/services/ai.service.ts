import { env } from "@/utils/env";
import { aiApiGateway } from "./ai.api";
import { aiMockGateway } from "./ai.mock";

const gateway = env.dataSource === "api" ? aiApiGateway : aiMockGateway;

export const aiService = {
  generatePlan: (input: Parameters<typeof gateway.generatePlan>[0]) => gateway.generatePlan(input),
  getOnboardingStatus: (onboardingId: number) => gateway.getOnboardingStatus(onboardingId),
};
