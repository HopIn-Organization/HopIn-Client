import { Navigate, useParams } from "react-router-dom";

export function ProjectAccessPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? Number(projectIdParam) : undefined;
  return <Navigate to={`/projects/${projectId ?? ""}/details`} replace />;
}
