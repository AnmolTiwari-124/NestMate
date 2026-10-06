import { useContext, useEffect, useMemo, useState } from "react";

import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import Navbar from "../../components/admin/Navbar";
import Sidebar from "../../components/admin/Sidebar";
import UserTable from "../../components/admin/UserTable";
import { AuthContext } from "../../context/AuthContextValue";
import API from "../../services/api";

function Users() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const currentUserId = currentUser?.id || currentUser?._id;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/users");

      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const confirmDelete = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      setError("");
      await API.delete(`/admin/users/${userToDelete._id}`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <main>
        <Navbar title="Users" />

        <section className="p-5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email"
            className="mb-5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white"
          />

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
              Loading users...
            </div>
          ) : (
            <UserTable
              currentUserId={currentUserId}
              users={filteredUsers}
              onDelete={setUserToDelete}
            />
          )}
        </section>
      </main>

      <ConfirmDeleteModal
        user={userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Users;
