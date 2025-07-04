import React, { useCallback, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SocketContext } from "@/context/SocketContextProvider";
import { authContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "@/context/ChatContextProvider";
import peer from "../services/peer";
const useStartVideoCall = () => {
  const { socket } = useContext(SocketContext);
  const { authUser } = useContext(authContext);
  const { currentReceiver,setVideoCallSender } = useContext(ChatContext);
  const navigate = useNavigate();
  const roomId = uuidv4();

  

  const startVideoCall = async () => {
    console.log("emitting video-call-init....");
    setVideoCallSender(authUser._id)
    const offer = await peer.getOffer();
    
    socket.emit("video-call-init", {
      callerId: authUser?._id,
      roomId,
      receiverId: currentReceiver?.userId._id,
      offer,
    });
    navigate(`/video-call/${roomId}`);
  };
  return { startVideoCall };
};

export default useStartVideoCall;
