import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "@/features/projects/hooks";
import { useProfileQuery } from "@/features/profile/hooks";
import { ProjectForm, ProjectFormValues } from "@/features/projects/components/ProjectForm";
import { ProjectMemberRoles } from "@/types/projectMember";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const mutation = useCreateProjectMutation();
  const { data: profile } = useProfileQuery();

  async function handleSubmit(values: ProjectFormValues) {
    const managerJob = {
      title: "manager",
      skills: [],
    };

    const jobs = [managerJob];

    const members = profile
      ? [
          {
            userId: profile.id,
            role: ProjectMemberRoles.ADMIN,
          },
        ]
      : [];

    await mutation.mutateAsync({
      name: values.name,
      description: values.description,
      repositoryUrl: values.repositoryUrl,
      jobs,
      members,
    });
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
