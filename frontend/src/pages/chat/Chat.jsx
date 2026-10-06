import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import { AuthContext } from "../../context/AuthContextValue";
import { MessageNotificationsContext } from "../../context/MessageNotificationsContextValue";
import API from "../../services/api";
import socket from "../../services/socket";

const getUserId = (user) => user?.id || user?._id;

const getRoomId = (firstUserId, secondUserId) =>
  [firstUserId, secondUserId].sort().join("_");

function Chat() {
  const { userId: selectedUserId } = useParams();
  const { user } = useContext(AuthContext);
  const { markConversationRead, unreadBySender } = useContext(
    MessageNotificationsContext
  );

  const currentUserId = getUserId(user);
  const [conversations, setConversations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef(null);

  const roomId = useMemo(() => {
    if (!currentUserId || !selectedUserId) {
      return "";
    }

    return getRoomId(currentUserId, selectedUserId);
  }, [currentUserId, selectedUserId]);

  const receiver = useMemo(() => {
    const conversation = conversations.find(
      (item) => item.userId === selectedUserId
    );

    return (
      conversation?.user ||
      matches.find((match) => match._id === selectedUserId) ||
      null
    );
  }, [conversations, matches, selectedUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    socket.emit("userOnline", currentUserId);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [currentUserId]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setLoadingConversations(true);

        const [conversationRes, matchesRes] = await Promise.all([
          API.get("/messages/conversations"),
          API.get("/auth/users"),
        ]);

        setConversations(conversationRes.data);
        setMatches(matchesRes.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    if (!roomId || !selectedUserId) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);

        const res = await API.get(`/messages/${roomId}`);

        if (isMounted) {
          setMessages(res.data);
          markConversationRead(selectedUserId, roomId);
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        if (isMounted) {
          setLoadingMessages(false);
        }
      }
    };

    socket.emit("joinRoom", roomId);
    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [markConversationRead, roomId, selectedUserId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const handleReceiveMessage = (message) => {
      if (message.roomId !== roomId) {
        return;
      }

      setMessages((prevMessages) => {
        if (prevMessages.some((item) => item._id === message._id)) {
          return prevMessages;
        }

        return [...prevMessages, message];
      });

      if (message.sender === selectedUserId) {
        markConversationRead(selectedUserId, roomId);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [markConversationRead, roomId, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!roomId || !selectedUserId || !currentUserId) {
      return;
    }

    socket.emit("sendMessage", {
      roomId,
      message,
      sender: currentUserId,
      receiver: selectedUserId,
      senderName: user?.name,
    });
  };

  return (
    <div className="h-[calc(100vh-73px)] min-h-[560px] bg-black text-white md:grid md:grid-cols-[360px_1fr]">
      <ChatSidebar
        conversations={conversations}
        loading={loadingConversations}
        onlineUsers={onlineUsers}
        selectedUserId={selectedUserId}
        unreadBySender={unreadBySender}
      />

      <ChatWindow
        currentUserId={currentUserId}
        loading={loadingMessages}
        messages={messages}
        messagesEndRef={messagesEndRef}
        onSendMessage={handleSendMessage}
        onlineUsers={onlineUsers}
        receiver={receiver}
        selectedUserId={selectedUserId}
      />
    </div>
  );
}

export default Chat;
