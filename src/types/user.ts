export type UserRole = "employee" | "teamLead";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export interface EmployeeProfile {
  userId: string;
  background: string;
  yearsInTech: number;
  knownTechnologies: Array<{
    name: string;
    level: "beginner" | "intermediate" | "advanced";
  }>;
}
