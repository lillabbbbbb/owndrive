import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode
  condition: boolean | null,
  isLoading?: boolean
};

//wrap a route into this (e.g. Home) if that route should be shown only in a specific condition
export function ProtectedRoute({ children, condition, isLoading }: ProtectedRouteProps) {

  if (isLoading) return <div>Loading...</div>;
  
  
  if (!condition) {
    console.log("navigating to login...")
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
