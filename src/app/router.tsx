import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/app/protected-route";
import { OnboardingPlanPage } from "@/pages/onboarding/OnboardingPlanPage";
import { OnboardingReviewPage } from "@/pages/onboarding/OnboardingReviewPage";
import { OnboardingStartPage } from "@/pages/onboarding/OnboardingStartPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { CreateProjectPage } from "@/pages/projects/CreateProjectPage";
import { ProjectAccessPage } from "@/pages/projects/ProjectAccessPage";
import { ProjectDetailsPage } from "@/pages/projects/ProjectDetailsPage";
import { ProjectSettingsPage } from "@/pages/projects/ProjectSettingsPage";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";
import { StatisticsPage } from "@/pages/projects/StatisticsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpChoicePage />} />
        <Route path="/register/email" element={<SignUpEmailPage />} />
        <Route path="/register/verify" element={<VerifyEmailPage />} />
        <Route path="/register/password" element={<SetPasswordPage />} />
        <Route path="/register/profile" element={<CompleteProfilePage />} /> */}

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
          <Route path="/projects/:projectId" element={<ProjectAccessPage />} />
          <Route path="/projects/:projectId/details" element={<ProjectDetailsPage />} />
          <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding/start" element={<OnboardingStartPage />} />
          <Route path="/onboarding/review" element={<OnboardingReviewPage />} />
          <Route path="/onboarding/plan/:planId" element={<OnboardingPlanPage />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
