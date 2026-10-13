import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "@/data/municipality";

/** /admin rotası uzman girişine yönlendirir. */
export function AdminPage() {
  return <Navigate to={APP_ROUTES.doctor} replace />;
}
