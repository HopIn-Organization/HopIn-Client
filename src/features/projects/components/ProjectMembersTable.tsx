import { useMemo } from "react";
import { ProjectMemberRow } from "@/features/projects/components/ProjectMemberRow";
import { FullProjectMember } from "@/types/projectMember";
import { Card } from "@/ui/Card";

interface ProjectMembersTableProps {
  searchValue: string;
  projectMembers: FullProjectMember[];
}

export function ProjectMembersTable({ searchValue, projectMembers }: ProjectMembersTableProps) {
  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return projectMembers;
    }

    return projectMembers.filter((employee) => {
      const email = employee.user.email ?? "";
      return (
        employee.user.name.toLowerCase().includes(normalizedSearch) ||
        email.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [projectMembers, searchValue]);

  return (
    <Card className="overflow-hidden shadow-soft">
      <div className="hidden grid-cols-[240px_120px_minmax(320px,1fr)_180px] gap-4 border-b border-border bg-surface-muted px-7 py-4 text-xs font-medium text-text-secondary md:grid">
        <span>Employee</span>
        <span>Role</span>
        <span>Progress</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {filteredEmployees.map((employee) => (
          <ProjectMemberRow key={employee.user.id} member={employee} />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="px-7 py-10 text-sm text-text-secondary">
          No team members match your search yet.
        </div>
      )}
    </Card>
  );
}
