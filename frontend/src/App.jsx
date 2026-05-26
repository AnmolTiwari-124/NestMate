
import { useContext } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import { AuthContext } from "./context/AuthContextValue";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/layout/Navbar";
import Profile from "./pages/profile/Profile";
import Matches from "./pages/matches/Matches";
import Chat from "./pages/chat/Chat";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";

function App() {
  const location = useLocation();
  const { authLoading } = useContext(AuthContext);
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/register" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <Navigate to="/admin" replace />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
export default App;

 
