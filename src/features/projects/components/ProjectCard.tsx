import { ArrowRight, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/types/project";
import { Card } from "@/ui/Card";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="p-8 shadow-soft">
      <div className="mb-8 flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Sparkles size={18} />
        </div>
        <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
          {project.role}
        </span>
      </div>

      <h3 className="mb-3 text-[34px] font-semibold leading-tight text-text-primary md:text-3xl">{project.name}</h3>
      <p className="min-h-[56px] text-sm text-text-secondary">{project.description}</p>

      <div className="my-8 h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <Users size={15} />
          {project.membersCount} members
        </span>

        <Link
          to="/onboarding/plan"
          className="grid h-8 w-8 place-items-center rounded-full bg-surface-muted text-text-primary transition hover:bg-primary-soft hover:text-primary"
          aria-label={`Open ${project.name}`}
        >
          <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
}
