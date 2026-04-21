import { FormEvent, useState } from "react";
import { ArrowLeft, Link2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "@/features/projects/hooks/hooks";
import { CreateJob } from "./CreateJob";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProjectMutation();
  const [jobs, setJobs] = useState<Array<{ title: string; skills: string[] }>>([
    { title: "", skills: [] },
  ]);

  function handleAddJob() {
    setJobs([...jobs, { title: "", skills: [] }]);
  }

  function handleUpdateJobTitle(index: number, title: string) {
    const updatedJobs = [...jobs];

    if (updatedJobs[index]) {
      updatedJobs[index].title = title;
    }

    setJobs(updatedJobs);
  }

  function handleUpdateJobSkills(index: number, skills: string[]) {
    const updatedJobs = [...jobs];

    if (updatedJobs[index]) {
      updatedJobs[index].skills = skills;
    }

    setJobs(updatedJobs);
  }

  function handleRemoveJob(index: number) {
    setJobs((currentJobs) => currentJobs.filter((_, currentIndex) => currentIndex !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await createProjectMutation.mutateAsync({
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      repositoryUrl: String(formData.get("repositoryUrl") ?? ""),
      jobs: jobs.map((job) => ({
        title: job.title,
        skills: job.skills.map((skill) => ({ name: skill })),
      })),
    });

    navigate("/projects");
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      <header className="space-y-2">
        <h1 className="text-4xl font-semibold text-text-primary">Create New Project</h1>
        <p className="text-lg text-text-secondary">
          Set up a new workspace for your team’s onboarding.
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="space-y-5 p-6">
          <h2 className="text-xl font-semibold text-text-primary">Project Details</h2>
          <div className="h-px bg-border" />

          <Input
            id="name"
            name="name"
            label="Project Name"
            placeholder="e.g Mobile App Redesign"
            required
          />

          <label htmlFor="description" className="block space-y-2 text-sm">
            <span className="text-xs font-medium text-text-secondary">Description</span>
            <textarea
              id="description"
              name="description"
              className="h-28 w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Briefly describe the project goals..."
              required
            />
          </label>

          <label htmlFor="repositoryUrl" className="block space-y-2 text-sm">
            <span className="text-xs font-medium text-text-secondary">
              GitHub Repository (Optional)
            </span>
            <div className="relative">
              <Link2
                size={14}
                className="pointer-events-none absolute left-3 top-3.5 text-text-secondary"
              />
              <input
                id="repositoryUrl"
                name="repositoryUrl"
                className="h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
                placeholder="https://github.com/org/repo"
                disabled={true}
              />
            </div>
          </label>
        </Card>

        <Card className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Job Roles & Requirements</h2>
              <p className="text-sm text-text-secondary">You can also add jobs after creation</p>
            </div>
            <Button
              type="button"
              onClick={handleAddJob}
              variant="outline"
              className="h-9 px-3 text-xs"
            >
              <Plus size={14} />
              Add Job
            </Button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {jobs.map((job, index) => (
              <CreateJob
                key={index}
                jobTitle={job.title}
                onJobTitleChange={(title) => handleUpdateJobTitle(index, title)}
                skills={job.skills}
                onSkillsChange={(skills) => handleUpdateJobSkills(index, skills)}
                onRemove={() => handleRemoveJob(index)}
              />
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="px-8" disabled={createProjectMutation.isPending}>
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </section>
  );
}
