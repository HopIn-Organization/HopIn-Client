import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, GitBranch, RefreshCw, Unlink } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { githubApi, GithubConnection, SyncStatus } from "../services/github.api";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";

interface Props {
  projectId: number;
  /** Flow context forwarded to the install round-trip ("create" = post-creation step). */
  from?: "create";
}

const STATUS_LABELS: Record<SyncStatus, string> = {
  pending: "Connected — waiting for first sync",
  syncing: "Syncing repository...",
  synced: "Synced",
  error: "Sync failed",
  revoked: "Access revoked — reconnect to restore",
};

export function GitHubConnectionCard({ projectId, from }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["github-connections", projectId];

  const { data: connections = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => githubApi.listConnections(projectId),
    refetchInterval: (query) => {
      const anyActive = (query.state.data ?? []).some(
        (c) => c.syncStatus === "syncing" || c.syncStatus === "pending",
      );
      return anyActive ? 4000 : 30000;
    },
  });

  const [connectError, setConnectError] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  const connectMutation = useMutation({
    mutationFn: ({ repoOwner, repoName }: { repoOwner: string; repoName: string }) =>
      githubApi.getInstallUrl(projectId, repoOwner, repoName, from),
    onSuccess: (result) => {
      if ('alreadyConnected' in result) {
        // App already installed on the repo — no GitHub round-trip needed,
        // the connection was created server-side. Stay on the page.
        toast.success("GitHub repository connected successfully!");
        void queryClient.invalidateQueries({ queryKey });
        setFormResetKey((k) => k + 1);
      } else {
        window.location.href = result.installUrl;
      }
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setConnectError(
        status === 409
          ? "This repository is already connected to the project"
          : "Could not start the GitHub connection. Please try again.",
      );
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (connectionId: number) => githubApi.disconnect(projectId, connectionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const syncMutation = useMutation({
    mutationFn: (connectionId: number) => githubApi.triggerSync(projectId, connectionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  // The connection id passed to the reconnect flow, so only that row's button spins
  const [reconnectingId, setReconnectingId] = useState<number | null>(null);

  return (
    <Card className="space-y-5 p-6">
      <h2 className="text-xl font-semibold text-text-primary">GitHub Repositories</h2>
      <div className="h-px bg-border" />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <img src="/github_loading_gif.gif" alt="Loading..." className="h-5 w-5" />
          Checking connections...
        </div>
      ) : (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="flex items-start gap-3">
              <GitBranch size={20} className="mt-0.5 shrink-0 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">No repositories connected</p>
                <p className="text-xs text-text-secondary">
                  Connect GitHub repos to enable code-aware onboarding plans.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection, index) => (
                <div key={connection.id} className="space-y-4">
                  {index > 0 && <div className="h-px bg-border" />}
                  <ConnectionRow
                    connection={connection}
                    onSync={() => syncMutation.mutate(connection.id)}
                    onDisconnect={() => disconnectMutation.mutate(connection.id)}
                    onReconnect={() => {
                      setReconnectingId(connection.id);
                      connectMutation.mutate({
                        repoOwner: connection.repoOwner,
                        repoName: connection.repoName,
                      });
                    }}
                    isSyncing={syncMutation.isPending && syncMutation.variables === connection.id}
                    isDisconnecting={
                      disconnectMutation.isPending && disconnectMutation.variables === connection.id
                    }
                    isReconnecting={connectMutation.isPending && reconnectingId === connection.id}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="h-px bg-border" />
          <AddRepositoryForm
            key={formResetKey}
            onConnect={(repoOwner, repoName) => {
              setConnectError(null);
              setReconnectingId(null);
              connectMutation.mutate({ repoOwner, repoName });
            }}
            isLoading={connectMutation.isPending && reconnectingId === null}
            serverError={connectError}
          />
        </div>
      )}
    </Card>
  );
}

function AddRepositoryForm({
  onConnect,
  isLoading,
  serverError,
}: {
  onConnect: (repoOwner: string, repoName: string) => void;
  isLoading: boolean;
  serverError: string | null;
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
    <div className="flex flex-col gap-2">
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
          {isLoading ? <img src="/github_loading_gif.gif" alt="" className="h-4 w-4" /> : <GitBranch size={14} />}
          {isLoading ? "Redirecting..." : "Add repository"}
        </Button>
      </div>
      {(error ?? serverError) && <p className="text-xs text-red-500">{error ?? serverError}</p>}
    </div>
  );
}

function ConnectionRow({
  connection,
  onSync,
  onDisconnect,
  onReconnect,
  isSyncing,
  isDisconnecting,
  isReconnecting,
}: {
  connection: GithubConnection;
  onSync: () => void;
  onDisconnect: () => void;
  onReconnect: () => void;
  isSyncing: boolean;
  isDisconnecting: boolean;
  isReconnecting: boolean;
}) {
  const { syncStatus, repoOwner, repoName, lastSyncedAt, lastError } = connection;
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
            <img src="/github_loading_gif.gif" alt="Syncing..." className="h-5 w-5 shrink-0" />
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
                <img src="/github_loading_gif.gif" alt="" className="h-3.5 w-3.5" />
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
