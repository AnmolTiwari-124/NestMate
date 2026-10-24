import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContextValue";

function ProtectedRoute({ children }) {
  const { authLoading, user } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="app-shell flex items-center justify-center text-sm font-medium text-muted">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
