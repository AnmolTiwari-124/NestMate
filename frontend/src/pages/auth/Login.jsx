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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-300">
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
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black p-3 rounded font-semibold"
        >
          {loading
            ? "Loading..."
            : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          New to NestMate?{" "}
          <Link to="/register" className="font-semibold text-white">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
