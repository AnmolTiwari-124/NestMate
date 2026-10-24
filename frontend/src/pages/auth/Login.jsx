import { useEffect, useState, useContext } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import API from "../../services/api";

import { AuthContext } from "../../context/AuthContextValue";

function Login() {
  const navigate = useNavigate();

  const { authLoading, login, user } = useContext(AuthContext);
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const from = location.state?.from?.pathname;
    navigate(from || (user.role === "admin" ? "/admin" : "/dashboard"), {
      replace: true,
    });
  }, [authLoading, location.state, navigate, user]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post(
        "/auth/login",
        formData
      );

      // Save user in context
      login(res.data.user, res.data.token);

      // Redirect by role
      const from = location.state?.from?.pathname;
      navigate(from || (res.data.user.role === "admin" ? "/admin" : "/dashboard"), {
        replace: true,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="surface-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-ink">Login</h1>
          <p className="mt-2 text-sm text-muted">
            Welcome back to NestMate.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-input mb-4"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          New to NestMate? {" "}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
