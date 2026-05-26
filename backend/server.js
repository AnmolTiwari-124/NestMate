const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const Message = require("./models/Message");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Connect Database
connectDB();

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store Online User Sockets
const onlineUserSockets = new Map();

const getOnlineUsers = () => Array.from(onlineUserSockets.keys());

const emitToUser = (userId, event, payload) => {
  if (!userId || !onlineUserSockets.has(userId)) {
    return;
  }

  onlineUserSockets.get(userId).forEach((socketId) => {
    io.to(socketId).emit(event, payload);
  });
};

const getUnreadSummary = async (receiverId) => {
  const unreadMessages = await Message.find({
    receiver: receiverId,
    read: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  const unreadBySender = {};
  const notifications = [];

  unreadMessages.forEach((message) => {
    if (!unreadBySender[message.sender]) {
      unreadBySender[message.sender] = {
        roomId: message.roomId,
        sender: message.sender,
        receiver: receiverId,
        senderName: message.senderName || "Someone",
        message: message.text,
        createdAt: message.createdAt,
        count: 0,
      };

      notifications.push(unreadBySender[message.sender]);
    }

    unreadBySender[message.sender].count += 1;
  });

  return {
    receiver: receiverId,
    totalUnread: unreadMessages.length,
    unreadBySender,
    notifications,
  };
};

// Socket Connection
io.on("connection", (socket) => {
  console.log("User connected");

  // User Online
  socket.on("userOnline", (userId) => {
    if (!userId) {
      return;
    }

    socket.userId = userId;

    if (!onlineUserSockets.has(userId)) {
      onlineUserSockets.set(userId, new Set());
    }

    onlineUserSockets.get(userId).add(socket.id);

    // Send updated users
    io.emit("onlineUsers", getOnlineUsers());

    getUnreadSummary(userId)
      .then((summary) => {
        socket.emit("unread-count-updated", summary);
      })
      .catch((error) => console.log(error));

    console.log(
      "Online Users:",
      getOnlineUsers()
    );
  });

  // Join Room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(
      `Joined room: ${roomId}`
    );
  });

  // Send Message
  socket.on(
    "sendMessage",
    async ({
      roomId,
      message,
      sender,
      receiver,
      senderName,
    }) => {
      try {
        // Save message
        const newMessage =
          await Message.create({
            roomId,
            sender,
            senderName,
            receiver,
            text: message,
          });

        // Emit message
        io.to(roomId).emit(
          "receiveMessage",
          newMessage
        );

        if (
          receiver &&
          receiver !== sender &&
          onlineUserSockets.has(receiver)
        ) {
          const unreadSummary =
            await getUnreadSummary(receiver);

          onlineUserSockets
            .get(receiver)
            .forEach((socketId) => {
              io.to(socketId).emit(
                "newMessageNotification",
                {
                  roomId,
                  sender,
                  receiver,
                  senderName:
                    senderName || "Someone",
                  message: newMessage.text,
                  createdAt:
                    newMessage.createdAt,
                  count:
                    unreadSummary.unreadBySender[
                      sender
                    ]?.count || 1,
                }
              );

              io.to(socketId).emit(
                "unread-count-updated",
                unreadSummary
              );
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );

  // Mark messages as read
  socket.on(
    "messages-read",
    async ({ roomId, sender, receiver }) => {
      try {
        const receiverId = socket.userId || receiver;

        if (!sender || !receiverId) {
          return;
        }

        const result = await Message.updateMany(
          {
            sender,
            receiver: receiverId,
            read: false,
          },
          {
            read: true,
          }
        );

        const payload = {
          roomId,
          sender,
          receiver: receiverId,
          readCount:
            result.modifiedCount || result.nModified || 0,
        };

        emitToUser(receiverId, "messages-read", payload);
        emitToUser(sender, "messages-read", payload);

        if (roomId) {
          io.to(roomId).emit("messages-read", payload);
        }

        const unreadSummary =
          await getUnreadSummary(receiverId);

        emitToUser(
          receiverId,
          "unread-count-updated",
          unreadSummary
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");

    if (socket.userId) {
      const userSockets =
        onlineUserSockets.get(socket.userId);

      userSockets?.delete(socket.id);

      if (userSockets?.size === 0) {
        onlineUserSockets.delete(socket.userId);
      }
    }

    io.emit(
      "onlineUsers",
      getOnlineUsers()
    );
  });
});

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

app.use(
  "/api/listings",
  require("./routes/listingRoutes")
);

app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
