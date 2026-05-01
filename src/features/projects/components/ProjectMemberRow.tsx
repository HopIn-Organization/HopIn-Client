import { useRef, useState } from "react";
import { Check, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeneratePlanMutation, useOnboardingPlansByProjectQuery } from "@/features/onboarding/hooks/useOnboardingData";
import { FullProjectMember, ProjectMemberRole, ProjectMemberRoles } from "@/types/projectMember";
import { Job } from "@/types/job";
import { classNames } from "@/utils/className";
import { MemberBoardButton } from "./MemberBoardButton";
import { useUpdateMemberRoleMutation, useRemoveMemberMutation } from "../hooks/members";
import { useClickOutside } from "@/hooks/useClickOutside";

interface ProjectMemberRowProps {
  member: FullProjectMember;
  projectJobs: Job[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProgressTone(progress: number) {
  if (progress >= 75) return "bg-success";
  if (progress > 0) return "bg-primary";
  return "bg-border";
}

function formatProjectRole(role: ProjectMemberRole) {
  return role === ProjectMemberRoles.ADMIN ? "Admin" : "Trainee";
}

export function ProjectMemberRow({ member, projectJobs }: ProjectMemberRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate: updateRole, isPending } = useUpdateMemberRoleMutation();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMemberMutation();
  const { mutateAsync: generatePlan, isPending: isGenerating } = useGeneratePlanMutation();
  const { data: onboardingPlans } = useOnboardingPlansByProjectQuery(member.projectId);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false), isMenuOpen);

  const existingPlan = onboardingPlans?.find((p) => p.user.id === member.user.id);

  async function handleGenerateOnboarding({ daysDuration, jobId }: { daysDuration: number; jobId: number }) {
    const plan = await generatePlan({
      userId: member.user.id,
      jobId,
      daysDuration,
    });
    navigate(`/onboarding/plan/${plan.id}`);
  }

  function handleViewBoard() {
    navigate(`/onboarding/plan/${existingPlan!.id}`);
  }

  const updateMemberRole = () => {
    setIsMenuOpen(false);

    const nextRole =
      member.role === ProjectMemberRoles.ADMIN
        ? ProjectMemberRoles.TRAINEE
        : ProjectMemberRoles.ADMIN;

    updateRole({
      projectId: member.projectId,
      memberId: String(member.id),
      role: nextRole,
    });
  };

  const handleRemoveMember = () => {
    setIsMenuOpen(false);
    removeMember({
      projectId: member.projectId,
      memberId: String(member.id),
    });
  };

  return (
    <div className="grid gap-4 px-5 py-5 md:grid-cols-[240px_120px_160px_minmax(260px,1fr)_210px] md:px-7">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1F1B4D] text-sm font-semibold text-white">
          {getInitials(member.user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">{member.user.name}</p>
          <p className="truncate text-sm text-text-secondary">
            {member.user.email ?? "No email provided"}
          </p>
        </div>
      </div>
      <div className="flex items-center text-sm text-text-primary">
        {formatProjectRole(member.role)}
      </div>
      <div className="flex items-center text-sm text-text-secondary truncate">
        {member.job.title}
      </div>
      <div className="space-y-2">
        <div className="h-2.5 max-w-[700px] rounded-full bg-surface-muted">
          <div
            className={classNames(
              "h-full rounded-full transition-all",
              getProgressTone(existingPlan?.progress ?? 0),
            )}
            style={{ width: `${existingPlan?.progress ?? 0}%` }}
          />
        </div>
        <div className="text-xs text-text-secondary">{existingPlan?.progress ?? 0}%</div>
      </div>
      <div className="flex items-center justify-end gap-2 justify-self-end">
        <MemberBoardButton
            hasOnboarding={!!existingPlan}
            employeeName={member.user.name}
            jobs={projectJobs}
            defaultJobId={member.job.id}
            onGenerate={handleGenerateOnboarding}
            onViewBoard={handleViewBoard}
            isGenerating={isGenerating}
          />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
            className="grid h-9 w-9 place-items-center rounded-xl text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
            aria-label={`Open actions for ${member.user.name}`}
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-10 w-48 rounded-xl border border-border bg-surface p-2 shadow-soft">
              <button
                type="button"
                onClick={handleRemoveMember}
                disabled={isRemoving}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 transition hover:bg-surface-muted"
              >
                {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Remove Member
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-primary transition hover:bg-surface-muted"
                disabled={isPending}
                onClick={updateMemberRole}
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Change role to{" "}
                {member.role === ProjectMemberRoles.ADMIN
                  ? ProjectMemberRoles.TRAINEE
                  : ProjectMemberRoles.ADMIN}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
