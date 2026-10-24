function formatMessageTime(value) {
  if (!value) {
    return "Now";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[70%] ${
          isMine
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md bg-white text-ink ring-1 ring-primary/15"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed md:text-base">
          {message.text}
        </p>

        <p
          className={`mt-2 text-right text-[11px] ${
            isMine ? "text-white/80" : "text-muted"
          }`}
        >
          {formatMessageTime(message.createdAt)}
          {isMine && <span className="ml-2">{message.read ? "Read" : "Sent"}</span>}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
