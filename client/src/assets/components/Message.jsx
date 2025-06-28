import React, { useState, useEffect, memo } from "react";
import { useAuthContext } from "../../context/AuthContext";
import dp from "../images/dp.png"
import useChatSide from "../hooks/useChatSide";
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
  const { authUser } = useAuthContext();
  const chatSide = useChatSide(authUser,message)
  const avatarUrl = message.senderId === authUser?._id
    ? authUser.profilePic
    : ReceiverForProfilePic.userId.profilePic;

  return (
    <div className={`chat ${chatSide} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full object-cover">
          <img
            alt="Avatar"
            src={avatarUrl || dp}
          />
        </div>
      </div>
      <div className=" max-w-[90%]">
        <div className={`chat-bubble pb-6 ${chatSide==="chat-end" ?"bg-blue-700":"bg-black"} min-w-full`}>
          <p> {message.message}</p>
          <time className="text-xs opacity-50 float-right text-white w-8 ">
            <p> {convertToIST(message.createdAt)}</p>
          </time>
        </div>
      </div>
    </div>
  );
});

export default Message;
