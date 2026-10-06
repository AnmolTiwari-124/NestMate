import { useEffect, useState } from "react";

import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import StatCard from "../../components/admin/StatCard";
import API from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <main>
        <Navbar title="Admin Dashboard" />

        <section className="p-5">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
              Loading dashboard...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard label="Total Users" value={stats?.totalUsers} />
              <StatCard label="Active Users" value={stats?.totalActiveUsers} />
              <StatCard label="New Users" value={stats?.newUsers} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
