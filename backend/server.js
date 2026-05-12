const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const Message = require("./models/Message");
const { Server } = require("socket.io");

const connectDB = require("./config/db");


dotenv.config();

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

// Socket Connection
io.on("connection", (socket) => {
  console.log("User connected");

  // Join Room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(`Joined room: ${roomId}`);
  });

  // Send Message
  socket.on(
    "sendMessage",
    async ({ roomId, message, sender }) => {
      try {
        // Save message
        const newMessage =
          await Message.create({
            roomId,
            sender,
            text: message,
          });

        // Emit message
        io.to(roomId).emit(
          "receiveMessage",
          newMessage
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
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

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 