import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode
  condition: boolean | null,
  isLoading?: boolean
};

//use this in the component where the routing is
//wrap each route into this
export function ProtectedRoute({ children, condition, isLoading }: ProtectedRouteProps) {

  if (isLoading) return <div>Loading...</div>;
  
  
  if (!condition) {
    console.log("navigating to login...")
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
