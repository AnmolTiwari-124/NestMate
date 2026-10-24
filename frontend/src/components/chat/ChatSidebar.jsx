import { Link } from "react-router-dom";
import ChatAvatar from "./ChatAvatar";

function formatPreviewTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function ChatSidebar({
  conversations,
  loading,
  onlineUsers,
  selectedUserId,
  unreadBySender = {},
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-primary/15 bg-white md:border-r">
      <div className="border-b border-primary/15 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">Chats</h1>
            <p className="mt-1 text-sm text-muted">
              Private roommate conversations
            </p>
          </div>

          <Link
            to="/matches"
            className="rounded-xl border border-primary/20 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/10"
          >
            Matches
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-primary/10" />
                  <div className="h-3 w-40 rounded bg-primary/5" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-lg font-semibold text-ink">No conversations yet</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Start from a match card and your chats will appear here.
              </p>
              <Link to="/matches" className="btn-primary mt-5">
                Find matches
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const user = conversation.user;
              const isActive = selectedUserId === conversation.userId;
              const isOnline = onlineUsers.includes(user?._id);
              const unreadCount =
                unreadBySender[conversation.userId]?.count ||
                conversation.unreadCount ||
                0;

              return (
                <Link
                  key={conversation.userId}
                  to={`/chat/${conversation.userId}`}
                  className={`flex items-center gap-3 rounded-xl p-3 transition ${
                    isActive
                      ? "bg-primary/10 text-ink"
                      : "text-ink hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <ChatAvatar user={user} isOnline={isOnline} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold">{user?.name || "Roommate"}</p>
                      <span className="shrink-0 text-xs text-muted">
                        {formatPreviewTime(conversation.latestMessage?.createdAt)}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm text-muted">
                        {conversation.latestMessage?.text || "No messages yet"}
                      </p>

                      {unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
