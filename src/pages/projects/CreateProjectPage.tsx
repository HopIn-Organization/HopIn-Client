import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "@/features/projects/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const mutation = useCreateProjectMutation();

  async function handleSubmit(values: ProjectFormValues) {
    await mutation.mutateAsync(values);
    navigate("/projects");
  }

  return (
    <ProjectForm
      backTo="/projects"
      backLabel="Back to Projects"
      heading="Create New Project"
      subheading="Set up a new workspace for your team's onboarding."
      isPending={mutation.isPending}
      submitLabel="Create Project"
      onSubmit={handleSubmit}
    />
  );
}
