import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextValue";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Welcome {user?.name}
      </h1>

      <button
        onClick={logout}
        className="bg-white text-black px-5 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
