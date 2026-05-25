import { apiClient } from "@/services/http/api-client";
import { ProjectDocument } from "@/types/document";

export const documentsApi = {
  async getDocuments(projectId: string): Promise<ProjectDocument[]> {
    const { data } = await apiClient.get<ProjectDocument[]>(`/projects/${projectId}/documents`);
    return data;
  },

  async uploadDocuments(projectId: string, files: File[]): Promise<ProjectDocument[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await apiClient.post<ProjectDocument[]>(
      `/projects/${projectId}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
      },
    );
    return data;
  },

  async deleteDocument(projectId: string, documentId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/documents/${documentId}`);
  },

  async getDownloadUrl(projectId: string, documentId: number): Promise<string> {
    const { data } = await apiClient.get<{ url: string }>(
      `/projects/${projectId}/documents/${documentId}/download`,
    );
    return data.url;
  },

  async getJobDocuments(projectId: string, jobId: string): Promise<ProjectDocument[]> {
    const { data } = await apiClient.get<ProjectDocument[]>(
      `/projects/${projectId}/jobs/${jobId}/documents`,
    );
    return data;
  },

  async uploadJobDocuments(
    projectId: string,
    jobId: string,
    files: File[],
  ): Promise<ProjectDocument[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await apiClient.post<ProjectDocument[]>(
      `/projects/${projectId}/jobs/${jobId}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
      },
    );
    return data;
  },

  async deleteJobDocument(projectId: string, jobId: string, documentId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/jobs/${jobId}/documents/${documentId}`);
  },
};
