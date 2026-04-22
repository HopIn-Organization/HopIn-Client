import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { Grid } from "@/ui/Layout";
import { useProjectsQuery } from "@/features/projects/hooks";

export function ProjectsPage() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();

  return (
    <section className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-5xl font-semibold text-text-primary">My Projects</h1>
          <p className="mt-2 text-xl text-text-secondary">
            Manage all of your projects’ onboarding and progress
          </p>
        </div>

        <Link
          to="/projects/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-soft"
        >
          <Plus size={18} />
          Create Project
        </Link>
      </header>

      {isLoading && <p className="text-sm text-text-secondary">Loading projects...</p>}
      {isError && <p className="text-sm text-red-500">Failed to load projects.</p>}

      <Grid>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </section>
  );
}
