import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContextValue";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
];

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <aside className="border-r border-zinc-800 bg-black px-4 py-5 lg:min-h-screen">
      <div className="mb-8 px-2">
        <p className="text-xl font-bold text-white">NestMate Admin</p>
        <p className="text-sm text-zinc-500">Control center</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Logout
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
