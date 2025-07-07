import React, { memo } from "react";
import { useAuthContext } from "@/context/AuthContextProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dp from "@/assets/images/dp.png";

export function convertToIST(utcDateString) {
  const date = new Date(utcDateString);
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const Message = memo(({ message, ReceiverForProfilePic }) => {
  const { authUser } = useAuthContext();
  const isSentByMe = message.senderId === authUser?._id;

  const avatarUrl = isSentByMe
    ? authUser?.profilePic
    : ReceiverForProfilePic?.userId?.profilePic;

  return (
    <div
      className={`flex w-full my-2 ${
        isSentByMe ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar */}
      {!isSentByMe && (
        <Avatar className="w-10 h-10 mr-2">
          <AvatarImage src={avatarUrl || dp} alt="avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}

      {/* Bubble */}
      <div
        className={`rounded-2xl px-4 py-2 text-sm relative max-w-[80%] break-words shadow-md transition-all duration-200 ease-in-out ${
          isSentByMe
            ? "bg-blue-700 text-white rounded-br-none"
            : "bg-zinc-800 text-white rounded-bl-none dark:bg-zinc-700"
        }`}
        style={{ paddingBottom: "1.5rem" }} // Add space for time
      >
        <p className="whitespace-pre-wrap">{message.message}</p>

        {/* Time positioned in bottom-right, outside text flow */}
        <div className="absolute bottom-1 right-2 text-xs text-white/70">
          {convertToIST(message.createdAt)}
        </div>
      </div>

      {/* Avatar on right if sent by me (optional) */}
      {isSentByMe && (
        <Avatar className="w-10 h-10 ml-2">
          <AvatarImage src={avatarUrl || dp} alt="avatar" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});

export default Message;
