import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextValue";
import { MessageNotificationsContext } from "../../context/MessageNotificationsContextValue";
import API from "../../services/api";
import socket from "../../services/socket";

function Matches() {
  const { user: currentUser } = useContext(AuthContext);
  const { unreadBySender } = useContext(
    MessageNotificationsContext
  );

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [personalityFilter, setPersonalityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    if (currentUser?.id || currentUser?._id) {
      socket.emit(
        "userOnline",
        currentUser.id || currentUser._id
      );
    }

    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users");

        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [currentUser]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.location?.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase());

    const matchesPersonality =
      personalityFilter === "" || user.personality === personalityFilter;

    const matchesBudget =
      budgetFilter === "" || user.budget <= Number(budgetFilter);

    return matchesSearch && matchesPersonality && matchesBudget;
  });

  const handleReportUser = async (user) => {
    const reason = window.prompt(`Why are you reporting ${user.name}?`);

    if (!reason) {
      return;
    }

    try {
      await API.post("/reports", {
        reportedUser: user._id,
        reason,
      });

      window.alert("Report submitted.");
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to submit report.");
    }
  };

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-black tracking-tight text-ink md:text-5xl">
          Your Best Matches
        </h1>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />

          <select
            value={personalityFilter}
            onChange={(e) => setPersonalityFilter(e.target.value)}
            className="form-input"
          >
            <option value="">All Personalities</option>
            <option value="introvert">Introvert</option>
            <option value="extrovert">Extrovert</option>
            <option value="ambivert">Ambivert</option>
          </select>

          <input
            type="number"
            placeholder="Max Budget"
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="relative rounded-3xl border border-primary/15 bg-white p-6 shadow-[0_10px_30px_rgba(249,115,22,0.06)] transition hover:-translate-y-0.5 hover:border-primary/30"
            >
              {unreadBySender[user._id]?.count > 0 && (
                <div className="absolute right-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-bold text-white">
                  {unreadBySender[user._id].count}
                </div>
              )}

              <div className="mb-4 flex items-start justify-between gap-3 pr-8">
                <div>
                  <h2 className="text-2xl font-bold text-ink">{user.name}</h2>
                  <p className="mt-1 text-sm text-muted">{user.occupation}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${onlineUsers.includes(user._id) ? "bg-secondary" : "bg-primary/40"}`}
                  />
                  <span className="text-xs font-medium text-muted">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {user.compatibilityScore}% match
              </div>

              <p className="mb-2 text-sm text-muted">📍 {user.location}</p>
              <p className="mb-2 text-sm text-muted">💰 Budget: ₹{user.budget}</p>
              <p className="mb-2 text-sm text-muted">Personality: {user.personality}</p>

              <p className="mt-4 text-sm leading-6 text-ink">{user.bio}</p>

              <div className="mt-5">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  Why This Match?
                </h3>

                <div className="space-y-2">
                  {user.insights?.map((insight, index) => (
                    <p key={index} className="text-sm text-secondary">
                      ✔ {insight}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  Common Interests
                </h3>

                <div className="flex flex-wrap gap-2">
                  {user.commonHobbies?.length > 0 ? (
                    user.commonHobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {hobby}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No common hobbies</p>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-1 text-sm text-muted">
                <p>🛏 Sleep: {user.habits?.sleepTime}</p>
                <p>🧹 Cleanliness: {user.habits?.cleanliness}</p>
                <p>🍽 Food: {user.habits?.foodPreference}</p>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                <Link
                  to={`/chat/${user._id}`}
                  className="relative block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  Chat
                  {unreadBySender[user._id]?.count > 0 && (
                    <span className="absolute right-3 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadBySender[user._id].count}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => handleReportUser(user)}
                  className="rounded-xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Matches;

