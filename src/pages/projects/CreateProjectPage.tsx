import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "@/features/projects/hooks";
import { useProfileQuery } from "@/features/profile/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";
import { ProjectMemberRoles } from "@/types/projectMember";
import { documentsApi } from "@/features/projects/services/documents.api";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const mutation = useCreateProjectMutation();
  const { data: profile, isLoading: isProfileLoading } = useProfileQuery();

  async function handleSubmit(values: ProjectFormValues) {
    try {
      const jobs = [{ title: "manager", skills: [] }, ...values.jobs];
      const members = profile ? [{ userId: profile.id, role: ProjectMemberRoles.ADMIN }] : [];

      const project = await mutation.mutateAsync({ name: values.name, description: values.description, jobs, members });

      if (values.pendingFiles.length > 0) {
        await documentsApi.uploadDocuments(project.id, values.pendingFiles);
      }

      const createdJobs = project.jobs ?? project.job ?? [];
      for (const [indexStr, files] of Object.entries(values.jobPendingFiles)) {
        if (files.length === 0) continue;
        const index = Number(indexStr);
        const jobTitle = values.jobs[index]?.title;
        if (!jobTitle) continue;
        const createdJob = createdJobs.find((j) => j.title === jobTitle);
        if (createdJob?.id) {
          await documentsApi.uploadJobDocuments(project.id, String(createdJob.id), files);
        }
      }

      // The GitHub step lives on its own route so it survives the full-page
      // redirect to GitHub and back (and plain refreshes).
      navigate(`/projects/${project.id}/github?from=create`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  }

  return (
    <ProjectForm
      backTo="/projects"
      backLabel="Back to Projects"
      heading="Create New Project"
      subheading="Set up a new workspace for your team's onboarding."
      isPending={mutation.isPending || isProfileLoading}
      submitLabel="Create Project"
      onSubmit={handleSubmit}
    />
  );
}
