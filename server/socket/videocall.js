const registerVideoCallHandler = async (socket, userSocketMap, io) => {
  socket.on(
    "video-call-init",
    async ({ callerId, roomId, receiverId, offer }) => {
      // console.log(callerId,roomId,receiverId)
      socket.join(roomId);
      // console.log("All sockets in room", roomId, [...io.sockets.adapter.rooms.get(roomId) || []]);
      // console.log(userSocketMap)
      const receiverSocketId = userSocketMap[receiverId];
      // console.log("receiver socket id", receiverSocketId)
      if (!receiverSocketId) {
        console.log("Receiver is offline");
        return;
      }
      socket
        .to(receiverSocketId)
        .emit("incoming-video-call", { callerId, roomId, receiverId, offer });
    }
  );

  socket.on(
    "join-video-call",
    async ({ callerId, roomId, receiverId, ans }) => {
      console.log("in the join-video-call");
      socket.join(roomId);
      const senderSocketId = userSocketMap[callerId];
      // console.log("All sockets in room", roomId, [...io.sockets.adapter.rooms.get(roomId) || []]);
      // console.log(ans ,"in joinedvideocall backend")
      socket
        .to(senderSocketId)
        .emit("joined-video-call", { callerId, roomId, receiverId, ans });
    }
  );

  socket.on("peer:nego:needed", async ({ receiverId, senderId, offer }) => {
    const senderSocketId = userSocketMap[senderId];
    if (!senderSocketId) {
      console.log("Sender is offline");
      return;
    }
    socket
      .to(senderSocketId)
      .emit("peer:negotiating", { receiverId, senderId, offer });
  });
  socket.on("peer:nego:done", async ({ senderId, receiverId, ans }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (!receiverSocketId) {
      console.log("Receiver is offline");
      return;
    }
    socket.to(receiverSocketId).emit("peer:nego:final", { ans });
  });

  socket.on("handle-ice-candidate", async ({ receiverId, iceCandidate }) => {
    // console.log("receiverId", receiverId, "with iceCandidate", iceCandidate);
    const receiverSocketId = userSocketMap[receiverId];
    if (!receiverSocketId) {
      console.log("user is offline");
      return;
    }
    socket.to(receiverSocketId).emit("add-ice-candidate", { iceCandidate });
  });

  socket.on("call-rejected", ({ callerId, receiverId, roomId }) => {
    const senderSocketId = userSocketMap[callerId];
    if (!senderSocketId) {
      console.log("Sender is offline");
      return;
    }
    socket.to(senderSocketId).emit("receiver-rejected-call")
  });
};

module.exports = { registerVideoCallHandler };
