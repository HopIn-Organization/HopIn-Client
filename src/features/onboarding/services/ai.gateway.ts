import { OnboardingGenerationJob, OnboardingStatusResult } from "@/types/onboarding";

export interface GenerateOnboardingPayload {
  userId: number;
  jobId: number;
  projectId?: string;
  daysDuration: number;
  documents?: string[];
}

export interface AiGateway {
  generatePlan(payload: GenerateOnboardingPayload): Promise<OnboardingGenerationJob>;
  getOnboardingStatus(onboardingId: number): Promise<OnboardingStatusResult>;
}
