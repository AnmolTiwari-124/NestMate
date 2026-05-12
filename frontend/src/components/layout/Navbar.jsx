import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center border-b border-zinc-800">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        RoomSync
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/matches">Matches</Link>

            <Link to="/dashboard">Dashboard</Link>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Logout
            </button>

            {/* Profile Circle */}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/signup"
              className="bg-white text-black px-4 py-2 rounded"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
