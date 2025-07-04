import { useContext, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCamera,
  FaFileAlt,
  FaHeadphones,
  FaImage,
  FaMagic,
  FaMapMarkerAlt,
  FaMicrophone,
  FaPoll,
  FaUser,
  FaVideo,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

import Message from "./Message";
import dp from "@/assets/images/dp.png";
import { ChatContext } from "@/context/ChatContextProvider";
import { useAuthContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContextProvider";
import MessageSkeleton from "@/skeleton/MessageSkeleton";
import useSendMessage from "@/hooks/useSendMessage";
import useStartVideoCall from "@/hooks/useStartVideoCall";
import useListenMessage from "@/hooks/useListenMessage";
import useFetchChats from "@/hooks/useFetchChats";

const Conversation = () => {
  useListenMessage();
  useFetchChats();

  const {
    currentConversation,
    currentReceiver,
    setCurrentReceiver,
    chatLoader,
  } = useContext(ChatContext);
  const { contacts } = useAuthContext();
  const { onlineUsers } = useContext(SocketContext);

  const lastMessageRef = useRef(null);
  const inputMessageRef = useRef(null);

  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { sendMessage, handleEmojiClick, handleAudio, handleDocumentChange } =
    useSendMessage(message, setMessage);
  const { startVideoCall } = useStartVideoCall();

  const ReceiverForProfilePic = contacts.find(
    (contact) => contact.userId._id === currentReceiver.userId._id
  );

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [currentConversation]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-muted shadow-sm">
        <div className="flex items-center gap-3">
          <FaArrowLeft
            onClick={() => setCurrentReceiver(null)}
            className="cursor-pointer"
          />
          <img
            src={currentReceiver.userId.profilePic || dp}
            className="w-10 h-10 object-cover rounded-full"
            alt="profile"
          />
          <div>
            <h1 className="text-base font-semibold">
              {currentReceiver.contactName}
            </h1>
            <p className="text-xs text-muted-foreground">
              {onlineUsers.includes(currentReceiver.userId._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaVideo
            onClick={startVideoCall}
            className="text-lg cursor-pointer"
          />
          <MdMoreVert className="text-xl cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-2">
        {chatLoader ? (
          [0, 1, 2].map((_, index) => <MessageSkeleton key={index} />)
        ) : currentConversation.length ? (
          currentConversation.map((msg) => (
            <div key={msg._id} ref={lastMessageRef}>
              <Message
                message={msg}
                ReceiverForProfilePic={ReceiverForProfilePic}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground mt-10">
            Send a message to start the conversation
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative px-3 py-2 border-t border-muted bg-white dark:bg-zinc-900 flex items-center gap-2">
        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-2 z-50"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </motion.div>
        )}

        {/* Attachment Modal */}
        {isAttachmentOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-2 z-50 bg-zinc-800 text-white rounded-xl shadow-xl p-4 grid grid-cols-4 gap-4 w-64"
          >
            {[ 
              { icon: <FaImage className="text-blue-400" />, label: "Gallery" },
              { icon: <FaCamera className="text-pink-400" />, label: "Camera" },
              { icon: <FaMapMarkerAlt className="text-green-500" />, label: "Location" },
              { icon: <FaUser className="text-blue-500" />, label: "Contact" },
              {
                icon: (
                  <label className="cursor-pointer">
                    <FaFileAlt className="text-purple-500" />
                    <input
                      type="file"
                      onChange={handleDocumentChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                  </label>
                ),
                label: "Document",
              },
              { icon: <FaHeadphones className="text-orange-400" />, label: "Audio" },
              { icon: <FaPoll className="text-yellow-400" />, label: "Poll" },
              { icon: <FaMagic className="text-indigo-400" />, label: "Imagine" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-xs">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        <button onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
          <BsEmojiSmile className="text-xl" />
        </button>

        <button onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}>
          <TiAttachment className="text-xl" />
        </button>

        <input
          type="text"
          ref={inputMessageRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-grow bg-transparent border border-muted px-4 py-2 rounded-xl text-sm outline-none"
        />

        <button
          onClick={message.trim() ? sendMessage : handleAudio}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {message.trim() ? (
            <IoSend className="text-lg" />
          ) : (
            <FaMicrophone className="text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Conversation;
