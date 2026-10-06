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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-300">
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
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

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
          minLength={6}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black p-3 rounded font-semibold"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-white">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
