import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, GitBranch, Loader2, RefreshCw, Unlink } from "lucide-react";
import { useState } from "react";
import { githubApi, GithubConnectionStatus, SyncStatus } from "../services/github.api";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface Props {
  projectId: number;
}

const STATUS_LABELS: Record<SyncStatus, string> = {
  pending: "Connected — waiting for first sync",
  syncing: "Syncing repository...",
  synced: "Synced",
  error: "Sync failed",
  revoked: "Access revoked — reconnect to restore",
};

export function GitHubConnectionCard({ projectId }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["github-status", projectId];

  const { data: status, isLoading } = useQuery({
    queryKey,
    queryFn: () => githubApi.getStatus(projectId),
    refetchInterval: (query) => {
      const s = query.state.data?.syncStatus;
      return s === "syncing" || s === "pending" ? 4000 : 30000;
    },
  });

  const connectMutation = useMutation({
    mutationFn: ({ repoOwner, repoName }: { repoOwner: string; repoName: string }) =>
      githubApi.getInstallUrl(projectId, repoOwner, repoName),
    onSuccess: (result) => {
      if ('alreadyConnected' in result) {
        window.location.href = `/projects/${projectId}/settings?github=connected`;
      } else {
        window.location.href = result.installUrl;
      }
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => githubApi.disconnect(projectId),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, null);
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => githubApi.triggerSync(projectId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <Card className="space-y-5 p-6">
      <h2 className="text-xl font-semibold text-text-primary">GitHub Repository</h2>
      <div className="h-px bg-border" />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 size={14} className="animate-spin" />
          Checking connection...
        </div>
      ) : status == null ? (
        <NotConnectedState
          onConnect={(repoOwner, repoName) => connectMutation.mutate({ repoOwner, repoName })}
          isLoading={connectMutation.isPending}
        />
      ) : (
        <ConnectedState
          status={status}
          onSync={() => syncMutation.mutate()}
          onDisconnect={() => disconnectMutation.mutate()}
          onReconnect={() =>
            connectMutation.mutate({ repoOwner: status.repoOwner, repoName: status.repoName })
          }
          isSyncing={syncMutation.isPending}
          isDisconnecting={disconnectMutation.isPending}
          isReconnecting={connectMutation.isPending}
        />
      )}
    </Card>
  );
}

function NotConnectedState({
  onConnect,
  isLoading,
}: {
  onConnect: (repoOwner: string, repoName: string) => void;
  isLoading: boolean;
}) {
  const [repo, setRepo] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConnect() {
    const match = repo.trim().match(/(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+?)\/?$/);
    if (!match) {
      setError("Enter a valid GitHub URL, e.g. https://github.com/owner/repo");
      return;
    }
    setError(null);
    onConnect(match[1]!, match[2]!);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <GitBranch size={20} className="mt-0.5 shrink-0 text-text-secondary" />
        <div>
          <p className="text-sm font-medium text-text-primary">No repository connected</p>
          <p className="text-xs text-text-secondary">
            Connect a GitHub repo to enable code-aware onboarding plans.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="https://github.com/owner/repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <Button onClick={handleConnect} disabled={isLoading || !repo.trim()} className="shrink-0">
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <GitBranch size={14} />}
          {isLoading ? "Redirecting..." : "Connect GitHub"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ConnectedState({
  status,
  onSync,
  onDisconnect,
  onReconnect,
  isSyncing,
  isDisconnecting,
  isReconnecting,
}: {
  status: GithubConnectionStatus;
  onSync: () => void;
  onDisconnect: () => void;
  onReconnect: () => void;
  isSyncing: boolean;
  isDisconnecting: boolean;
  isReconnecting: boolean;
}) {
  const { syncStatus, repoOwner, repoName, lastSyncedAt, lastError } = status;
  const isRevoked = syncStatus === "revoked";
  const isError = syncStatus === "error";
  const isActivelySyncing = syncStatus === "syncing" || syncStatus === "pending";
  // Only block the button while a sync is actually running; "pending" means queued,
  // and the user should be able to trigger a manual sync if needed.
  const isSyncButtonDisabled = isSyncing || syncStatus === "syncing";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {isRevoked ? (
            <AlertCircle size={18} className="text-amber-500" />
          ) : isError ? (
            <AlertCircle size={18} className="text-red-500" />
          ) : isActivelySyncing ? (
            <Loader2 size={18} className="animate-spin text-primary" />
          ) : (
            <CheckCircle2 size={18} className="text-green-500" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">
              {repoOwner}/{repoName}
            </p>
            <p className="text-xs text-text-secondary">{STATUS_LABELS[syncStatus]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRevoked ? (
            <Button
              onClick={onReconnect}
              disabled={isReconnecting}
              variant="secondary"
              className="h-8 px-3 text-xs"
            >
              {isReconnecting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <GitBranch size={12} />
              )}
              Reconnect
            </Button>
          ) : (
            <Button
              onClick={onSync}
              disabled={isSyncButtonDisabled}
              variant="outline"
              className="h-8 px-3 text-xs"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Starting..." : "Sync Now"}
            </Button>
          )}
          <Button
            onClick={onDisconnect}
            disabled={isDisconnecting}
            variant="ghost"
            className="h-8 px-3 text-xs text-text-secondary"
          >
            <Unlink size={12} />
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </Button>
        </div>
      </div>

      {lastSyncedAt && (
        <p className="text-xs text-text-secondary">
          Last synced: {new Date(lastSyncedAt).toLocaleString()}
        </p>
      )}
      {isError && lastError && (
        <p className="text-xs text-red-500">{lastError}</p>
      )}
    </div>
  );
}
