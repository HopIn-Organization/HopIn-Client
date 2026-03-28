export type ProjectRole = "Admin" | "Trainee";

export interface Project {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  role: ProjectRole;
}

export interface ProjectStatistics {
  projectId: string;
  teamMembers: number;
  averageProgress: number;
  completionRate: number;
}
