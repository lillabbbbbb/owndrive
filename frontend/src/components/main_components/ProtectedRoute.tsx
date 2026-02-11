import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/globalContext";

type ProtectedRouteProps = {
  children: ReactNode
  condition: boolean
};

//use this in the component where the routing is
//wrap each route into this
export function ProtectedRoute({ children, condition }: ProtectedRouteProps) {

  if (!condition) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // else render the requested page
}
