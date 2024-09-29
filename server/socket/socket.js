const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const userSocketMap = {}; // Track online users with objectId:socketId

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  // console.log("User connected with socket_ID: ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // console.log(userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit only when userId is valid
  }

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update list when a user disconnects
    }
  });
});

module.exports = { app, server, io ,getReceiverSocketId};