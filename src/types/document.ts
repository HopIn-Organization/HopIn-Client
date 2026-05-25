export interface ProjectDocument {
  id: number;
  originalName: string;
  s3Key: string;
  mimeType: string;
  sizeBytes: number;
  projectId: number;
  jobId: number | null;
  uploadedAt: string;
}
