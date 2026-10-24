import { Link } from "react-router-dom";
import ChatAvatar from "./ChatAvatar";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

function ChatWindow({
  currentUserId,
  loading,
  messages,
  messagesEndRef,
  onSendMessage,
  onlineUsers,
  receiver,
  selectedUserId,
}) {
  if (!selectedUserId) {
    return (
      <section className="hidden h-full min-h-0 items-center justify-center bg-canvas px-8 text-center md:flex">
        <div className="max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-white text-2xl font-bold text-primary">
            #
          </div>
          <h2 className="mt-5 text-2xl font-bold text-ink">Select a conversation</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Pick a roommate from the sidebar to continue chatting.
          </p>
        </div>
      </section>
    );
  }

  const isOnline = onlineUsers.includes(selectedUserId);

  return (
    <section className="flex h-full min-h-0 flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-primary/15 bg-white px-4 py-3 shadow-sm">
        <Link
          to="/chats"
          className="rounded-xl border border-primary/20 px-3 py-2 text-sm font-medium text-primary md:hidden"
        >
          Back
        </Link>

        <ChatAvatar user={receiver} isOnline={isOnline} />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-ink">
            {receiver?.name || "Roommate"}
          </h2>
          <p className="text-sm text-muted">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>

        <Link
          to="/matches"
          className="hidden rounded-xl border border-primary/20 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/10 md:inline-flex"
        >
          Matches
        </Link>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div className="max-w-xs">
              <p className="text-xl font-semibold text-ink">Start the conversation</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Send a message to open a private chat with this match.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message._id || `${message.sender}-${message.createdAt}`}
                message={message}
                isMine={message.sender === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput disabled={loading || !selectedUserId} onSendMessage={onSendMessage} />
    </section>
  );
}

export default ChatWindow;
