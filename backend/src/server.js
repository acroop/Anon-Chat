
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import {
  rooms,
  createRoom,
  joinRoom,
  removeUser
} from "./roomManager.js";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  
  },
  maxHttpBufferSize: 10e6 // 5 MB
});

app.get("/", (req, res) => {
  res.send("Socket.IO backend running ");
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  
  socket.on("create_room", () => {
    const roomId = createRoom(socket.id);
    socket.join(roomId);
    socket.emit("room_created", { roomId });
    console.log("Room created:", roomId);
  });

  socket.on("join_room", ({ roomId }) => {
    const success = joinRoom(roomId, socket.id);

    if (!success) {
      socket.emit("error", "Room not found");
      return;
    }

    socket.join(roomId);
    io.to(roomId).emit("user_joined", socket.id);
  });

  socket.on("send_message", ({ roomId, message }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].messages.push(message);
    io.to(roomId).emit("receive_message", message);
  });

  socket.on("send_file", ({ roomId, file }) => {
    if (!rooms[roomId]) return;

    
    if (file.size > 5 * 1024 * 1024) {
      socket.emit("error", "File too large");
      return;
    }

    rooms[roomId].files.push(file);
    io.to(roomId).emit("receive_file", file);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    const result = removeUser(socket.id);

    if (result?.destroyed) {
      io.to(result.roomId).emit("room_closed");
      console.log("Room destroyed:", result.roomId);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
