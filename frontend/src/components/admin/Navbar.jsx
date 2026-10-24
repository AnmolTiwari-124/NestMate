import { useContext } from "react";

import { AuthContext } from "../../context/AuthContextValue";

function Navbar({ title }) {
  const { user } = useContext(AuthContext);

  return (
    <header className="border-b border-primary/15 bg-white px-6 py-5 shadow-sm">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>
      </div>
    </header>
  );
}

export default Navbar;
