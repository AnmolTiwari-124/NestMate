import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextValue";

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold mb-6">
        Find Your Perfect Roommate
      </h1>

      <p className="text-zinc-400 max-w-2xl mb-8 text-lg">
        AI-powered roommate and PG matching platform
        for students and professionals.
      </p>

      <div className="flex gap-4">
        {user ? (
          <Link
            to={user.role === "admin" ? "/admin" : "/dashboard"}
            className="bg-white text-black px-6 py-3 rounded font-semibold"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="bg-white text-black px-6 py-3 rounded font-semibold"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
