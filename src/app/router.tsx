import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/app/protected-route";
import { CompleteProfilePage } from "@/pages/auth/CompleteProfilePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SetPasswordPage } from "@/pages/auth/SetPasswordPage";
import { SignUpChoicePage } from "@/pages/auth/SignUpChoicePage";
import { SignUpEmailPage } from "@/pages/auth/SignUpEmailPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { OnboardingPlanPage } from "@/pages/onboarding/OnboardingPlanPage";
import { OnboardingReviewPage } from "@/pages/onboarding/OnboardingReviewPage";
import { OnboardingStartPage } from "@/pages/onboarding/OnboardingStartPage";
import { CreateProjectPage } from "@/pages/projects/CreateProjectPage";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";
import { StatisticsPage } from "@/pages/projects/StatisticsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpChoicePage />} />
        <Route path="/register/email" element={<SignUpEmailPage />} />
        <Route path="/register/verify" element={<VerifyEmailPage />} />
        <Route path="/register/password" element={<SetPasswordPage />} />
        <Route path="/register/profile" element={<CompleteProfilePage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell>
                <Outlet />
              </AppShell>
            </ProtectedRoute>
          }
        >
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/onboarding/start" element={<OnboardingStartPage />} />
          <Route path="/onboarding/review" element={<OnboardingReviewPage />} />
          <Route path="/onboarding/plan" element={<OnboardingPlanPage />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
