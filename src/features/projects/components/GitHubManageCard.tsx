import { useQuery } from "@tanstack/react-query";
import { GitBranch, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { githubApi } from "../services/github.api";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface Props {
  projectId: number;
}

/**
 * Read-only GitHub summary shown on the settings page. Connecting a repo
 * redirects the whole tab to GitHub, which would drop unsaved form edits —
 * so the actual connect/sync/disconnect actions live on the dedicated
 * /projects/:id/github page this card links to.
 */
export function GitHubManageCard({ projectId }: Props) {
  const navigate = useNavigate();

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["github-connections", projectId],
    queryFn: () => githubApi.listConnections(projectId),
  });

  return (
    <Card className="space-y-5 p-6">
      <h2 className="text-xl font-semibold text-text-primary">GitHub Repositories</h2>
      <div className="h-px bg-border" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {isLoading ? (
            <img src="/github_loading_gif.gif" alt="Loading..." className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <GitBranch size={20} className="mt-0.5 shrink-0 text-text-secondary" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">
              {isLoading
                ? "Checking connections..."
                : connections.length === 0
                  ? "No repositories connected"
                  : `${connections.length} ${connections.length === 1 ? "repository" : "repositories"} connected`}
            </p>
            <p className="text-xs text-text-secondary">
              {connections.length > 0
                ? connections.map((c) => `${c.repoOwner}/${c.repoName}`).join(", ")
                : "Connect GitHub repos to enable code-aware onboarding plans."}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate(`/projects/${projectId}/github`)}
          className="h-8 shrink-0 px-3 text-xs"
        >
          <Settings2 size={12} />
          Manage repositories
        </Button>
      </div>
    </Card>
  );
}
