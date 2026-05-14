import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

      const res = await API.post("/auth/register", formData);

      login(res.data.user);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data?.message);
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
          Signup
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded bg-zinc-800"
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded font-semibold"
        >
          {loading ? "Loading..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
