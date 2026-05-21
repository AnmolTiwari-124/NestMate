import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageNotificationsContext } from "../../context/MessageNotificationsContextValue";
import API from "../../services/api";
import socket from "../../services/socket";

function Matches() {
  const { unreadBySender } = useContext(
    MessageNotificationsContext
  );

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [personalityFilter, setPersonalityFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (currentUser?.id || currentUser?._id) {
      socket.emit(
        "userOnline",
        currentUser.id || currentUser._id
      );
    }

    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await API.get(
          "/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">Your Best Matches</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"
        />

        {/* Personality */}
        <select
          value={personalityFilter}
          onChange={(e) => setPersonalityFilter(e.target.value)}
          className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"
        >
          <option value="">All Personalities</option>

          <option value="introvert">Introvert</option>

          <option value="extrovert">Extrovert</option>

          <option value="ambivert">Ambivert</option>
        </select>

        {/* Budget */}
        <input
          type="number"
          placeholder="Max Budget"
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
          className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-white transition"
          >
            {unreadBySender[user._id]?.count > 0 && (
              <div className="absolute right-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-green-500 px-2 text-xs font-bold text-black">
                {unreadBySender[user._id].count}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pr-8">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-3 h-3 rounded-full ${onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-zinc-600"
                    }`}
                />

                <span className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>

              <div className="bg-green-500 text-black px-3 py-1 rounded-full font-bold">
                {user.compatibilityScore}%
              </div>
            </div>

            {/* Basic Info */}
            <p className="text-zinc-400 mb-2">{user.occupation}</p>

            <p className="mb-2">📍 {user.location}</p>

            <p className="mb-2">💰 Budget: ₹{user.budget}</p>

            <p className="mb-2">Personality: {user.personality}</p>

            {/* Bio */}
            <p className="text-zinc-300 mt-4">{user.bio}</p>

            {/* Common Interests */}
            <div className="mt-5">
              <h3 className="font-semibold mb-2">Why This Match?</h3>

              <div className="space-y-2">
                {user.insights?.map((insight, index) => (
                  <p key={index} className="text-sm text-green-400">
                    ✔ {insight}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold mb-2">Common Interests</h3>

              <div className="flex flex-wrap gap-2">
                {user.commonHobbies?.length > 0 ? (
                  user.commonHobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                    >
                      {hobby}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">No common hobbies</p>
                )}
              </div>
            </div>

            {/* Habits */}
            <div className="mt-5 text-sm text-zinc-400 space-y-1">
              <p>🛏 Sleep: {user.habits?.sleepTime}</p>

              <p>🧹 Cleanliness: {user.habits?.cleanliness}</p>

              <p>🍽 Food: {user.habits?.foodPreference}</p>
            </div>
            <Link
              to={`/chat/${user._id}`}
              className="relative block mt-6 bg-white text-black text-center py-3 rounded-xl font-semibold"
            >
              Chat
              {unreadBySender[user._id]?.count > 0 && (
                <span className="absolute right-4 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-green-500 px-1 text-xs font-bold text-black ring-2 ring-white">
                  {unreadBySender[user._id].count}
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;

