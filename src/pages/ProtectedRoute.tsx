import { ReactNode } from "react";
import { useAuth } from "../util/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (!user && !isLoading) {
    return (
      <Navigate
        to={"/login?forward=" + location.pathname}
        replace
        state={{ targetSite: "test" }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
