import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContextValue";

function AdminProtectedRoute({ children }) {
  const { authLoading, user } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
