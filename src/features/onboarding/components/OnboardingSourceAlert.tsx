import { useState } from "react";
import { AlertTriangle, Download, ExternalLink, GitBranch, Info } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Alert } from "@/ui/Alert";
import { onboardingService } from "@/features/onboarding/services/onboarding.service";
import { OnboardingPlan, RepoKnowledgeRepoRef } from "@/types/onboarding";

interface OnboardingSourceAlertProps {
  plan: OnboardingPlan;
  isAdmin: boolean;
}

export function OnboardingSourceAlert({ plan, isAdmin }: OnboardingSourceAlertProps) {
  const status = plan.knowledgeMeta?.status ?? "none";
  const repos = plan.knowledgeMeta?.repos ?? [];
  const projectId = plan.project.id;
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function handleDownload(repo: RepoKnowledgeRepoRef) {
    try {
      setDownloadingId(repo.connectionId);
      const blob = await onboardingService.downloadRepoKnowledge(plan.id, repo.connectionId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${repo.repoOwner}-${repo.repoName}-repo-knowledge.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download the repository summary. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  if (status === "used") {
    return (
      <Alert variant="info" icon={<GitBranch size={16} />}>
        <p className="font-medium text-text-primary">
          This onboarding was generated based on {repos.length} GitHub{" "}
          {repos.length === 1 ? "repository" : "repositories"}.
        </p>
        <ul className="space-y-1">
          {repos.map((repo) => (
            <li key={repo.connectionId} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href={repo.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {repo.repoOwner}/{repo.repoName}
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={() => handleDownload(repo)}
                disabled={downloadingId === repo.connectionId}
                className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary disabled:opacity-60"
              >
                <Download size={12} />
                {downloadingId === repo.connectionId ? "Downloading…" : "Download summary"}
              </button>
            </li>
          ))}
        </ul>
      </Alert>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="warning" icon={<AlertTriangle size={16} />}>
        <p>
          There was an error relying on GitHub, so this onboarding was generated using
          documentation knowledge.
        </p>
      </Alert>
    );
  }

  // status === "none"
  return (
    <Alert variant="warning" icon={<Info size={16} />}>
      <p>This onboarding was generated without GitHub repositories.</p>
      {isAdmin ? (
        <Link
          to={`/projects/${projectId}/github`}
          className="inline-flex items-center gap-1 font-medium underline hover:no-underline"
        >
          <GitBranch size={13} />
          Connect GitHub
        </Link>
      ) : (
        <p>We recommend asking your admin to connect it.</p>
      )}
    </Alert>
  );
}
