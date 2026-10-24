import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../services/api";
import { AuthContext } from "../../context/AuthContextValue";

function Signup() {
  const navigate = useNavigate();

  const { authLoading, login, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/dashboard", {
      replace: true,
    });
  }, [authLoading, navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/register", formData);

      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="surface-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-ink">Register</h1>
          <p className="mt-2 text-sm text-muted">
            Create your NestMate profile.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm font-medium text-primary">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input mb-4"
        />

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
          minLength={6}
          className="form-input mb-4"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account? {" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
