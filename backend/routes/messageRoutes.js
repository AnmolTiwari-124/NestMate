const express = require("express");

const router = express.Router();

const Message = require("../models/Message");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Get unread message notifications
router.get("/notifications/unread", protect, async (req, res) => {
  try {
    const receiverId = req.user._id.toString();

    const unreadMessages = await Message.find({
      receiver: receiverId,
      read: false,
    }).sort({ createdAt: -1 });

    const notificationsBySender = new Map();

    unreadMessages.forEach((message) => {
      if (!notificationsBySender.has(message.sender)) {
        notificationsBySender.set(message.sender, {
          roomId: message.roomId,
          sender: message.sender,
          receiver: receiverId,
          senderName:
            message.senderName || "Someone",
          message: message.text,
          createdAt: message.createdAt,
          count: 1,
        });

        return;
      }

      const notification =
        notificationsBySender.get(message.sender);

      notification.count += 1;
    });

    res.status(200).json(
      Array.from(notificationsBySender.values())
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Mark a sender's messages as read
router.put(
  "/notifications/:senderId/read",
  protect,
  async (req, res) => {
    try {
      await Message.updateMany(
        {
          sender: req.params.senderId,
          receiver: req.user._id.toString(),
          read: false,
        },
        {
          read: true,
        }
      );

      res.status(200).json({
        message: "Notifications cleared",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Get all conversations for the logged-in user
router.get("/conversations", protect, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const conversationsByUser = new Map();

    messages.forEach((message) => {
      const otherUserId =
        message.sender === currentUserId
          ? message.receiver
          : message.sender;

      if (!otherUserId) {
        return;
      }

      if (!conversationsByUser.has(otherUserId)) {
        conversationsByUser.set(otherUserId, {
          userId: otherUserId,
          latestMessage: message,
          unreadCount: 0,
        });
      }

      if (
        message.receiver === currentUserId &&
        message.read === false
      ) {
        const conversation =
          conversationsByUser.get(otherUserId);

        conversation.unreadCount += 1;
      }
    });

    const userIds = Array.from(conversationsByUser.keys());

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("name email profileImage occupation location")
      .lean();

    const usersById = new Map(
      users.map((user) => [user._id.toString(), user])
    );

    const conversations = Array.from(
      conversationsByUser.values()
    ).map((conversation) => ({
      ...conversation,
      user: usersById.get(conversation.userId) || {
        _id: conversation.userId,
        name:
          conversation.latestMessage.senderName ||
          "Roommate",
      },
    }));

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get messages by room
router.get("/:roomId", protect, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const messages = await Message.find({
      roomId: req.params.roomId,
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
