import { useMemo, useState } from "react";
import { ArrowLeft, Search, Settings, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import usersData from "@/mocks/users.json";
import skillsData from "@/mocks/skills.json";
import { FullProjectMember } from "@/types/projectMember";
import { Skill } from "@/types/skill";
import { User } from "@/types/user";
import { Tabs } from "@/ui/Tabs";
import { ProjectMembersTable } from "@/features/projects/components/ProjectMembersTable";
import { env } from "@/utils/env";
import { useProjectQuery } from "@/features/projects/hooks";

interface StoredUser extends Omit<User, "skills"> {
  skillIds: number[];
}

const skills = skillsData as Skill[];
const users = (usersData as StoredUser[]).map((user) => ({
  ...user,
  skills: user.skillIds
    .map((skillId) => skills.find((skill) => skill.id === skillId))
    .filter((skill): skill is Skill => Boolean(skill)),
}));

type ProjectTab = "members" | "statistics";

const projectTabs = [
  { label: "Team Members", value: "members" },
  // { label: "Statistics", value: "statistics" },
] as const satisfies readonly { label: string; value: ProjectTab }[];

export function ProjectDetailsPage() {
  const { projectId = "" } = useParams();
  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const [activeTab, setActiveTab] = useState<ProjectTab>("members");
  const [searchValue, setSearchValue] = useState("");

  const projectMembers = useMemo<FullProjectMember[] | undefined>(
    () =>
      env.dataSource === "api"
        ? project?.members?.map((member) => ({
            ...member,
            progress: member.progress ?? 0,
          }))
        : users.flatMap((user) =>
            (user.projectMemberships ?? [])
              .filter((membership) => membership.projectId === projectId)
              .map((membership) => ({
                ...membership,
                user,
                progress: membership.progress ?? 0,
              })),
          ),
    [project?.members, projectId],
  );

  if (isLoading) {
    return <p className="text-sm text-text-secondary">Loading project details...</p>;
  }

  if (isError || !project) {
    return <p className="text-sm text-red-500">Failed to load project details.</p>;
  }

  return (
    <section className="mx-auto w-full max-w-[1600px] space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to Projects
      </Link>

      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">Projects / Details</p>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-text-primary">{project.name}</h1>
              <p className="mt-2 max-w-2xl text-lg text-text-secondary">
                {project.description || "Manage team members and track onboarding progress."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/projects/${projectId}/settings`}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-medium text-text-primary transition hover:bg-surface-muted"
          >
            <Settings size={15} />
            Settings
          </Link>
          {/* <Button type="button" className="h-11 px-5">
            <Plus size={15} />
            Add Member
          </Button> */}
        </div>
      </header>

      <Tabs items={projectTabs} value={activeTab} onValueChange={setActiveTab} />

      {projectMembers ? (
        <div className="space-y-6">
          <label className="relative block max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by name or email..."
              className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary"
            />
          </label>
          <ProjectMembersTable searchValue={searchValue} projectMembers={projectMembers} projectJobs={project.jobs ?? []} />
        </div>
      ) : (
        <div className="text-sm text-text-secondary">No team members found yet.</div>
      )}
    </section>
  );
}
