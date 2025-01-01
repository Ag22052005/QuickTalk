import React, { useState, useEffect, memo } from "react";
import { useAuthContext } from "../../context/AuthContext";

export function convertToIST(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleTimeString('en-IN', { 
    timeZone: 'Asia/Kolkata', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  });
}

const Message = memo(({ message,ReceiverForProfilePic }) => {
  const [chatSide, setChatSide] = useState("");
  const { authUser } = useAuthContext();
  console.log("message",message)
  useEffect(() => {
    if (authUser?._id) {
      if (message.senderId === authUser._id) {
        setChatSide("chat-end");
      } else {
        setChatSide("chat-start");
      }
    }
  }, [message.senderId, authUser]);
  console.log("authUser in message component",authUser)
  const avatarUrl = message.senderId === authUser?._id
    ? authUser.profilePic
    : ReceiverForProfilePic.userId.profilePic;

  return (
    <div className={`chat ${chatSide} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Avatar"
            src={avatarUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
          />
        </div>
      </div>
      <div>
        <div className={`chat-bubble pb-6 ${chatSide==="chat-end" ?"bg-blue-700":"bg-black"}`}>
          {message.message}
          <time className="text-xs opacity-50 float-right text-white">
            {convertToIST(message.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
});

export default Message;
