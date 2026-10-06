import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextValue";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Welcome {user?.name}
      </h1>
      <p className="text-zinc-400">
        Manage your profile, matches, and conversations from the navigation.
      </p>
    </div>
  );
}

export default Dashboard;
