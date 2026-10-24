import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContextValue";
import { MessageNotificationsContext } from "../../context/MessageNotificationsContextValue";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const {
    totalUnread,
  } = useContext(MessageNotificationsContext);

  const navigate = useNavigate();

  return (
    <nav className="border-b border-primary/15 bg-white/95 px-8 py-4 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-ink">
          NestMate
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-muted">
          {user ? (
            <>
              <Link to="/matches" className="transition hover:text-primary">
                Matches
              </Link>

              <Link to="/chats" className="relative transition hover:text-primary">
                Chats
                {totalUnread > 0 && (
                  <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                    {totalUnread}
                  </span>
                )}
              </Link>

              <Link to="/dashboard" className="transition hover:text-primary">
                Dashboard
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" className="transition hover:text-primary">
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn-ghost"
              >
                Logout
              </button>

              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-sm transition hover:bg-primary-dark"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-primary">
                Login
              </Link>

              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
