import { useState } from "react";

function ChatInput({ disabled = false, onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t border-primary/15 bg-white/95 p-3 md:p-4"
    >
      <textarea
        rows={1}
        value={message}
        disabled={disabled}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
        placeholder="Message"
        className="max-h-32 min-h-12 min-w-0 flex-1 resize-none rounded-2xl border border-primary/15 bg-[#FFFBF5] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/30 disabled:text-white/80"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
