import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/features/projects/services/documents.api";
import { projectKeys } from "./projectKeys";

export const documentKeys = {
  byProject: (projectId: number | undefined) =>
    [...projectKeys.byId(projectId), "documents"] as const,
};

export function useProjectDocumentsQuery(projectId: number | undefined) {
  return useQuery({
    queryKey: documentKeys.byProject(projectId),
    queryFn: () => documentsApi.getDocuments(projectId!),
    enabled: projectId != null,
  });
}

export function useUploadDocumentsMutation(projectId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => documentsApi.uploadDocuments(projectId!, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.byProject(projectId) });
    },
  });
}

export function useDeleteDocumentMutation(projectId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) => documentsApi.deleteDocument(projectId!, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.byProject(projectId) });
    },
  });
}
