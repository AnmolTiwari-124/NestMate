import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextValue";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-shell p-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-primary/15 bg-white p-8 shadow-[0_10px_30px_rgba(249,115,22,0.08)]">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-ink">
          Welcome {user?.name}
        </h1>
        <p className="text-base text-muted">
          Manage your profile, matches, and conversations from the navigation.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
