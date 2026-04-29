import { useNavigate, useParams } from "react-router-dom";
import { useProjectQuery, useUpdateProjectMutation } from "@/features/projects/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";

export function ProjectSettingsPage() {
  const { projectId = "" } = useParams();
  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const navigate = useNavigate();
  const mutation = useUpdateProjectMutation();

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading project...</p>;
  }

  if (isError || !project) {
    return <p className="text-sm text-red-500">Failed to load project.</p>;
  }

  async function handleSubmit(values: ProjectFormValues) {
    await mutation.mutateAsync({ id: project!.id, ...values });
    navigate(`/projects/${project!.id}/details`);
  }

  const existingJobs = (project.jobs ?? project.job ?? []).map((job) => ({
    ...(job.id !== undefined && { id: job.id }),
    title: job.title,
    skills: job.skills?.map((s) => s.name) ?? [],
  }));

  return (
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
      isPending={mutation.isPending}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
    />
  );
}
