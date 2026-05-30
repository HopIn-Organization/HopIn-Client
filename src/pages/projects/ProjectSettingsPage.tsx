import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useProjectQuery, useUpdateProjectMutation } from "@/features/projects/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";
import { useProjectRole } from "@/hooks/useProjectRole";
import { ProjectMemberRoles } from "@/types/projectMember";
import {
  useProjectDocumentsQuery,
  useUploadDocumentsMutation,
  useDeleteDocumentMutation,
} from "@/features/projects/hooks/documents";
import { documentsApi } from "@/features/projects/services/documents.api";
import { useQuery } from "@tanstack/react-query";

export function ProjectSettingsPage() {
  const { projectId = "" } = useParams();
  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const navigate = useNavigate();
  const mutation = useUpdateProjectMutation();
  const role = useProjectRole(projectId, project?.members);
  const { data: documents = [] } = useProjectDocumentsQuery(projectId);
  const uploadMutation = useUploadDocumentsMutation(projectId);
  const deleteMutation = useDeleteDocumentMutation(projectId);

  const jobs = project?.jobs ?? project?.job ?? [];
  const jobIds = jobs.map((j) => String(j.id)).filter(Boolean);

  const { data: jobDocumentsMap = {} } = useQuery({
    queryKey: ["jobDocuments", projectId, jobIds],
    queryFn: async () => {
      const result: Record<string, any[]> = {};
      for (const jobId of jobIds) {
        result[jobId] = await documentsApi.getJobDocuments(projectId, jobId);
      }
      return result;
    },
    enabled: jobIds.length > 0,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load project.");
      navigate("/projects");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isLoading && role !== null && role !== ProjectMemberRoles.ADMIN) {
      navigate(`/projects/${projectId}/details`, { replace: true });
    }
  }, [isLoading, role, projectId, navigate]);

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading project...</p>;
  }

  async function handleSubmit(values: ProjectFormValues) {
    await mutation.mutateAsync({ id: project!.id, ...values });

    try {
      if (values.pendingFiles.length > 0) {
        await uploadMutation.mutateAsync(values.pendingFiles);
      }

      const existingJobs = project!.jobs ?? project!.job ?? [];
      for (const [indexStr, files] of Object.entries(values.jobPendingFiles)) {
        if (files.length === 0) continue;
        const index = Number(indexStr);
        const jobData = values.jobs[index];
        if (!jobData) continue;

        if (jobData.id) {
          await documentsApi.uploadJobDocuments(projectId, String(jobData.id), files);
        } else {
          const matched = existingJobs.find((j) => j.title === jobData.title);
          if (matched?.id) {
            await documentsApi.uploadJobDocuments(projectId, String(matched.id), files);
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload documents");
      return;
    }

    navigate(`/projects/${project!.id}/details`);
  }

  const existingJobs = (project?.jobs ?? project?.job ?? []).map((job) => ({
    ...(job.id !== undefined && { id: String(job.id) }),
    title: job.title,
    skills: job.skills?.map((s) => s.name) ?? [],
  }));

  return (
    !isError &&
    project && (
      <ProjectForm
        backTo={`/projects/${project.id}/details`}
        backLabel="Back to Project"
        heading="Project Settings"
        subheading={`Update the details for ${project.name}.`}
        defaultValues={{
          name: project.name,
          description: project.description ?? "",
          repositoryUrl: project.repositoryUrl ?? "",
          jobs: existingJobs,
        }}
        existingDocuments={documents}
        existingJobDocuments={jobDocumentsMap}
        onDeleteDocument={(docId) => deleteMutation.mutate(docId)}
        isDeletingDocument={deleteMutation.isPending}
        isPending={mutation.isPending}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    )
  );
}
