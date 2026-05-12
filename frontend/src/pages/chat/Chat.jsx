import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on(
      "receiveMessage",
      (newMessage) => {
        setMessages((prev) => [
          ...prev,
          newMessage,
        ]);
      }
    );

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", message);

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Chat
      </h1>

      {/* Messages */}
      <div className="bg-zinc-900 rounded-xl p-5 h-[500px] overflow-y-auto mb-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-zinc-800 p-3 rounded-lg mb-3"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="flex-1 bg-zinc-900 p-3 rounded-xl border border-zinc-800"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
