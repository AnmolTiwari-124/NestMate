import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextValue";

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-shell flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          Smart roommate matching for modern living
        </div>

        <h1 className="mb-6 text-5xl font-black tracking-tight text-ink md:text-7xl">
          Find Your Perfect Roommate
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-muted">
          A roommate matching platform for students and professionals seeking
          safety, compatibility, and a home that feels right.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/dashboard"}
              className="btn-primary"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Register
              </Link>

              <Link to="/login" className="btn-ghost">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
