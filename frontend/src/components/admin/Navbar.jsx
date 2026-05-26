import { useContext } from "react";

import { AuthContext } from "../../context/AuthContextValue";

function Navbar({ title }) {
  const { user } = useContext(AuthContext);

  return (
    <header className="border-b border-zinc-800 bg-black px-6 py-5">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>
      </div>
    </header>
  );
}

export default Navbar;
