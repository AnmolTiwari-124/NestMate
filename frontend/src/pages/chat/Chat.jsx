import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const socket = io("http://localhost:5000");
const ROOM_ID = "general";

function Chat() {
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${ROOM_ID}`);

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

    socket.emit("joinRoom", ROOM_ID);

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

    socket.emit("sendMessage", {
      roomId: ROOM_ID,
      message,
      sender: user?.name || "User",
    });

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
            key={msg._id || index}
            className="bg-zinc-800 p-3 rounded-lg mb-3"
          >
            <p className="text-sm text-zinc-400 mb-1">
              {msg.sender}
            </p>

            <p>{msg.text}</p>
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
