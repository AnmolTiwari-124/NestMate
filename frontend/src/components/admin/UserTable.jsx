function UserTable({ currentUserId, onDelete, users }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-[0_10px_30px_rgba(249,115,22,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-primary/15 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Joined Date</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {users.map((user) => {
              const isCurrentAdmin =
                currentUserId === user._id || currentUserId === user.id;

              return (
                <tr key={user._id}>
                  <td className="px-4 py-4 font-semibold text-ink">
                    {user.name}
                    {isCurrentAdmin && (
                      <span className="ml-2 rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-muted">{user.email}</td>
                  <td className="px-4 py-4 text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      disabled={isCurrentAdmin}
                      onClick={() => onDelete(user)}
                      className="rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-primary/10 disabled:text-muted disabled:hover:bg-transparent"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan="4">
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
