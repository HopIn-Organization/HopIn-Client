import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useProjectQuery, useUpdateProjectMutation, useDeleteProjectMutation } from "@/features/projects/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";
import { useProjectRole } from "@/hooks/useProjectRole";
import { ProjectMemberRoles } from "@/types/projectMember";
import {
  useProjectDocumentsQuery,
  useUploadDocumentsMutation,
  useDeleteDocumentMutation,
} from "@/features/projects/hooks/documents";
import { documentsApi } from "@/features/projects/services/documents.api";
import { ProjectDocument } from "@/types/document";
import { useQuery } from "@tanstack/react-query";

export function ProjectSettingsPage() {
  const { projectId = "" } = useParams();
  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const navigate = useNavigate();
  const mutation = useUpdateProjectMutation();
  const deleteMutation = useDeleteProjectMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isDeletingRef = useRef(false);
  const role = useProjectRole(projectId, project?.members);
  const { data: documents = [] } = useProjectDocumentsQuery(projectId);
  const uploadMutation = useUploadDocumentsMutation(projectId);
  const deleteDocumentMutation = useDeleteDocumentMutation(projectId);

  const jobs = project?.jobs ?? project?.job ?? [];
  const jobIds = jobs.map((j) => String(j.id)).filter(Boolean);

  const { data: jobDocumentsMap = {} } = useQuery({
    queryKey: ["jobDocuments", projectId, jobIds],
    queryFn: async () => {
      const result: Record<string, ProjectDocument[]> = {};
      for (const jobId of jobIds) {
        result[jobId] = await documentsApi.getJobDocuments(projectId, jobId);
      }
      return result;
    },
    enabled: jobIds.length > 0,
  });

  useEffect(() => {
    if (isError && !isDeletingRef.current) {
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

  async function handleDeleteProject() {
    try {
      isDeletingRef.current = true;
      await deleteMutation.mutateAsync(projectId);
      toast.success("Project deleted successfully.");
      navigate("/projects", { replace: true });
    } catch {
      isDeletingRef.current = false;
      toast.error("Failed to delete project.");
    }
  }

  async function handleSubmit(values: ProjectFormValues) {
    if (!project) return;
    await mutation.mutateAsync({ id: project.id, ...values });

    if (values.pendingFiles.length > 0) {
      await uploadMutation.mutateAsync(values.pendingFiles);
    }

    const existingJobs = project.jobs ?? project.job ?? [];
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

    navigate(`/projects/${project.id}/details`);
  }

  if (!project) return null;
  const existingJobs = (project.jobs ?? project.job ?? []).map((job) => ({
    ...(job.id !== undefined && { id: String(job.id) }),
    title: job.title,
    skills: job.skills?.map((s) => s.name) ?? [],
  }));

  return (
    !isError &&
    project && (
      <div>
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
          onDeleteDocument={(docId) => deleteDocumentMutation.mutate(docId)}
          isDeletingDocument={deleteDocumentMutation.isPending}
          isPending={mutation.isPending}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="mb-1 text-sm font-semibold text-red-700">Danger Zone</h3>
          <p className="mb-4 text-sm text-red-600">
            Deleting this project is permanent and cannot be undone. All members, jobs, and documents will be removed.
          </p>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-700">Are you sure?</span>
              <button
                onClick={handleDeleteProject}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, delete project"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Delete Project
            </button>
          )}
        </div>
      </div>
    )
  );
}
