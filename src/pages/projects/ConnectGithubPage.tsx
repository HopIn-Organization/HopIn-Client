import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { GitHubConnectionCard } from "@/features/projects/components/GitHubConnectionCard";
import { useProjectQuery } from "@/features/projects/hooks";
import { useProjectRole } from "@/hooks/useProjectRole";
import { ProjectMemberRoles } from "@/types/projectMember";
import { Button } from "@/ui/Button";

/**
 * Dedicated page for managing a project's GitHub connections.
 * The GitHub App install flow leaves the site entirely, so it must never be
 * launched from a page holding unsaved form state — this page holds none, and
 * the backend callback redirects straight back here.
 *
 * Reached from project settings, and right after project creation with
 * `?from=create` (which swaps the footer to finish the create flow).
 */
export function ConnectGithubPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromCreate = searchParams.get("from") === "create";

  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const role = useProjectRole(projectId, project?.members);

  useEffect(() => {
    const githubParam = searchParams.get("github");
    if (!githubParam) return;

    if (githubParam === "connected") {
      toast.success("GitHub repository connected successfully!");
    } else if (githubParam === "error") {
      const reason = searchParams.get("reason") ?? "Failed to connect GitHub repository.";
      toast.error(reason, { duration: 8000 });
    }

    const next = new URLSearchParams(searchParams);
    next.delete("github");
    next.delete("reason");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load project.");
      navigate("/projects");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isLoading && role !== null && role !== ProjectMemberRoles.ADMIN) {
      navigate(`/projects/${projectId}/details`, { replace: true });
    }
  }, [isLoading, role, projectId, navigate]);

  if (projectId == null || Number.isNaN(projectId)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <img src="/github_loading_gif.gif" alt="Loading..." className="h-16 w-16" />
        <p className="text-sm text-text-secondary">Loading project...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Cover photo — GitHub logo as large background, title overlaid */}
      <div className="relative h-60 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900">
        <img
          src="/github_logo_and_title.png"
          alt=""
          aria-hidden
          className="h-full w-full select-none object-contain opacity-30 dark:invert dark:opacity-20"
        />
        {/* Bottom gradient so title text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/95 via-gray-50/20 to-transparent dark:from-gray-900/95 dark:via-gray-900/20" />
        <div className="absolute bottom-0 left-0 right-0 px-10 pb-7">
          <h1 className="text-3xl font-bold text-text-primary">
            {fromCreate ? "Connect GitHub" : "GitHub Repositories"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {fromCreate
              ? "Optionally link repositories to enable code-aware onboarding plans."
              : `Manage the repositories connected to ${project.name}.`}
          </p>
        </div>
      </div>

      {/* Card slides over the cover photo */}
      <div className="relative z-10 -mt-4 space-y-5">
        <GitHubConnectionCard projectId={projectId} {...(fromCreate && { from: "create" })} />

        <div className="flex justify-end gap-3">
          {fromCreate ? (
            <Button onClick={() => navigate("/projects")} className="px-8 py-3 text-base">
              Done
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate(`/projects/${projectId}/settings`)}
              className="px-6 py-2"
            >
              Back to Settings
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
