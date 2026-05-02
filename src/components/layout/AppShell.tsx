import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { OnboardingGenerationWatcher } from "@/features/onboarding/components/OnboardingGenerationWatcher";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-8">{children}</main>
      <OnboardingGenerationWatcher />
    </div>
  );
}
