import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center border-b border-zinc-800">
      <Link to="/" className="text-2xl font-bold">
        RoomSync
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

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