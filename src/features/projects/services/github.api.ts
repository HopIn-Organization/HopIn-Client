import { apiClient } from "@/services/http/api-client";

export type SyncStatus = "pending" | "syncing" | "synced" | "error" | "revoked";

export interface GithubConnection {
  id: number;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  lastCommitSha: string | null;
  lastError: string | null;
  repoOwner: string;
  repoName: string;
  isPrivate: boolean;
  defaultBranch: string;
  connectedAt: string;
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

  async listConnections(projectId: number): Promise<GithubConnection[]> {
    const { data } = await apiClient.get<GithubConnection[]>(
      `/projects/${projectId}/github`,
    );
    return data;
  },

  async disconnect(projectId: number, connectionId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/github/${connectionId}`);
  },

  async triggerSync(projectId: number, connectionId: number): Promise<void> {
    await apiClient.post(`/projects/${projectId}/github/${connectionId}/sync`);
  },
};
