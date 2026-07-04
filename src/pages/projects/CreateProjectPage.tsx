import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "@/features/projects/hooks";
import { useProfileQuery } from "@/features/profile/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";
import { GitHubConnectionCard } from "@/features/projects/components/GitHubConnectionCard";
import { ProjectMemberRoles } from "@/types/projectMember";
import { documentsApi } from "@/features/projects/services/documents.api";
import { Button } from "@/ui/Button";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const mutation = useCreateProjectMutation();
  const { data: profile, isLoading: isProfileLoading } = useProfileQuery();
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);

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

      setCreatedProjectId(project.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  }

  if (createdProjectId != null) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-semibold text-text-primary">Connect GitHub</h1>
          <p className="text-lg text-text-secondary">
            Optionally link a repository to enable code-aware onboarding plans.
          </p>
        </header>

        <GitHubConnectionCard projectId={createdProjectId} />

        <div className="flex justify-end">
          <Button onClick={() => navigate("/projects")} className="px-8 py-3 text-base">
            Done
          </Button>
        </div>
      </section>
    );
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
