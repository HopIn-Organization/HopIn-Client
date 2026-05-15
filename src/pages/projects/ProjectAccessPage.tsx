import { Navigate, useParams } from "react-router-dom";

export function ProjectAccessPage() {
  const { projectId = "" } = useParams();
  return <Navigate to={`/projects/${projectId}/details`} replace />;
}