function UserTable({ currentUserId, onDelete, users }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-zinc-800 text-left text-xs font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Joined Date</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => {
              const isCurrentAdmin =
                currentUserId === user._id || currentUserId === user.id;

              return (
                <tr key={user._id}>
                  <td className="px-4 py-4 font-semibold text-white">
                    {user.name}
                    {isCurrentAdmin && (
                      <span className="ml-2 rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{user.email}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      disabled={isCurrentAdmin}
                      onClick={() => onDelete(user)}
                      className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan="4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
