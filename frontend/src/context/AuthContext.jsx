import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContextValue";
import API from "../services/api";

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user.id || user._id,
    role: user.role || "user",
  };
};

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(storedUser));
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [authLoading, setAuthLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Login
  const login = useCallback((userData, token) => {
    const nextUser = normalizeUser(userData);

    setUser(nextUser);

    localStorage.setItem("user", JSON.stringify(nextUser));

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        login(res.data, token);
      } catch (error) {
        clearSession();
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, [clearSession, login]);

  useEffect(() => {
    window.addEventListener("auth:session-expired", clearSession);

    return () => {
      window.removeEventListener("auth:session-expired", clearSession);
    };
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
