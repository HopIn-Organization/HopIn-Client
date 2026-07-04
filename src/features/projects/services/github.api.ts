import { apiClient } from "@/services/http/api-client";

export type SyncStatus = "pending" | "syncing" | "synced" | "error" | "revoked";

export interface GithubConnectionStatus {
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  lastCommitSha: string | null;
  repoOwner: string;
  repoName: string;
}

export type ConnectResult = { alreadyConnected: true } | { installUrl: string };

export const githubApi = {
  async getInstallUrl(projectId: number, repoOwner: string, repoName: string): Promise<ConnectResult> {
    const { data } = await apiClient.post<ConnectResult>(
      `/projects/${projectId}/github/connect`,
      { repoOwner, repoName },
    );
    return data;
  },

  async getStatus(projectId: number): Promise<GithubConnectionStatus | null> {
    try {
      const { data } = await apiClient.get<GithubConnectionStatus>(
        `/projects/${projectId}/github/status`,
      );
      return data;
    } catch (err: unknown) {
      if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
      throw err;
    }
  },

  async disconnect(projectId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/github`);
  },

  async triggerSync(projectId: number): Promise<void> {
    await apiClient.post(`/projects/${projectId}/github/sync`);
  },
};
