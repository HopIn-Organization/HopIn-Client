import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/features/projects/services/documents.api";
import { projectKeys } from "./projectKeys";

export const documentKeys = {
  byProject: (projectId: string) => [...projectKeys.byId(projectId), "documents"] as const,
};

export function useProjectDocumentsQuery(projectId: string) {
  return useQuery({
    queryKey: documentKeys.byProject(projectId),
    queryFn: () => documentsApi.getDocuments(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUploadDocumentsMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => documentsApi.uploadDocuments(projectId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.byProject(projectId) });
    },
  });
}

export function useDeleteDocumentMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) => documentsApi.deleteDocument(projectId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.byProject(projectId) });
    },
  });
}
