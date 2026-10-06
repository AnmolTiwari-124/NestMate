import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import API from "../services/api";
import socket from "../services/socket";
import { AuthContext } from "./AuthContextValue";
import { MessageNotificationsContext } from "./MessageNotificationsContextValue";

const getUserId = (user) => user?.id || user?._id;

function normalizeNotifications(notifications) {
  return notifications.reduce((summary, notification) => {
    if (!notification.sender) {
      return summary;
    }

    summary[notification.sender] = {
      ...notification,
      count: notification.count || 1,
    };

    return summary;
  }, {});
}

function MessageNotificationsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const userId = getUserId(user);
  const [unreadBySender, setUnreadBySender] = useState({});

  useEffect(() => {
    if (!userId) {
      const clearTimer = setTimeout(() => {
        setUnreadBySender({});
      }, 0);

      return () => clearTimeout(clearTimer);
    }

    let isMounted = true;

    const fetchUnreadMessages = async () => {
      try {
        const res = await API.get("/messages/notifications/unread");

        if (isMounted) {
          setUnreadBySender(normalizeNotifications(res.data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    socket.emit("userOnline", userId);
    fetchUnreadMessages();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const handleNotification = (notification) => {
      if (notification.receiver !== userId) {
        return;
      }

      setUnreadBySender((prevUnreadBySender) => {
        const previous =
          prevUnreadBySender[notification.sender];

        return {
          ...prevUnreadBySender,
          [notification.sender]: {
            ...previous,
            ...notification,
            count:
              notification.count ||
              (previous?.count || 0) + 1,
          },
        };
      });
    };

    const handleUnreadSummary = (summary) => {
      if (summary.receiver !== userId) {
        return;
      }

      setUnreadBySender(summary.unreadBySender || {});
    };

    const handleMessagesRead = (payload) => {
      if (payload.receiver !== userId) {
        return;
      }

      setUnreadBySender((prevUnreadBySender) => {
        const nextUnreadBySender = {
          ...prevUnreadBySender,
        };

        delete nextUnreadBySender[payload.sender];

        return nextUnreadBySender;
      });
    };

    socket.on(
      "newMessageNotification",
      handleNotification
    );
    socket.on(
      "unread-count-updated",
      handleUnreadSummary
    );
    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off(
        "newMessageNotification",
        handleNotification
      );
      socket.off(
        "unread-count-updated",
        handleUnreadSummary
      );
      socket.off("messages-read", handleMessagesRead);
    };
  }, [userId]);

  const markConversationRead = useCallback(
    (senderId, roomId) => {
      if (!userId || !senderId) {
        return;
      }

      setUnreadBySender((prevUnreadBySender) => {
        const nextUnreadBySender = {
          ...prevUnreadBySender,
        };

        delete nextUnreadBySender[senderId];

        return nextUnreadBySender;
      });

      socket.emit("messages-read", {
        roomId,
        sender: senderId,
        receiver: userId,
      });
    },
    [userId]
  );

  const value = useMemo(() => {
    const notifications = Object.values(unreadBySender).sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );

    const totalUnread = notifications.reduce(
      (total, notification) =>
        total + (notification.count || 0),
      0
    );

    return {
      markConversationRead,
      notifications,
      totalUnread,
      unreadBySender,
    };
  }, [markConversationRead, unreadBySender]);

  return (
    <MessageNotificationsContext.Provider value={value}>
      {children}
    </MessageNotificationsContext.Provider>
  );
}

export default MessageNotificationsProvider;
