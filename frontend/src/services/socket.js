import { io } from "socket.io-client";

const socket = io("https://nestmate-backend-qso7.onrender.com",{
  autoConnect: true,
});

export default socket;
