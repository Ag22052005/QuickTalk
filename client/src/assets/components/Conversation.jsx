import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import Message from "./Message";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { FaImage, FaCamera, FaMapMarkerAlt, FaUser, FaFileAlt, FaHeadphones, FaPoll, FaMagic, FaMicrophone } from "react-icons/fa";
import { ChatContext } from "../../context/ChatContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import useListenMessage from "../hooks/useListenMessage";
import { useAuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContextProvider";
import { FaArrowLeft } from "react-icons/fa6";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

const Conversation = () => {
  useListenMessage();
  const token = localStorage.getItem("authToken");
  const { currentConversation, setCurrentConversation, currentReceiver, setCurrentReceiver } = useContext(ChatContext);
  const { contacts } = useAuthContext();
  const lastMessageRef = useRef(null);
  const inputMessageRef = useRef(null);
  const { onlineUsers } = useContext(SocketContext);

  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [currentConversation]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_URL}/send/${currentReceiver.userId}`,
          { message: message.trim() },
          { headers: { authorization: `bearer ${token}` } }
        )
        .then((res) => {
          const newMessage = res.data;
          setCurrentConversation([...currentConversation, newMessage]);
          setMessage("");
        })
        .catch((error) => {
          console.log("send msg error", error);
          toast.error("Internal Server Error");
        });
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleAudio = () => {
    console.log("Audio recording feature triggered.");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white fixed z-50 w-full backdrop-blur-md conversationHead">
        <div className="flex items-center space-x-3">
          <FaArrowLeft onClick={() => setCurrentReceiver(null)} />
          <div className="w-10 h-10 bg-gray-200 rounded-full">
            <img src="" alt="" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">{currentReceiver.contactName}</h1>
            <p className="text-sm">{onlineUsers.includes(currentReceiver.userId) ? "Online" : "Offline"}</p>
          </div>
        </div>
        <MdMoreVert className="text-2xl cursor-pointer text-white" />
      </div>

      {/* Message Area */}
      <div className="flex-grow overflow-y-auto bg-gray-900 p-4 mt-14">
        <ul className="space-y-2">
          {currentConversation.map((message) => (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          ))}
        </ul>
      </div>

      {/* Input Area */}
      <div className="relative flex items-center p-2">
        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-2 z-50 bg-gray-800 rounded-lg shadow-lg"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </motion.div>
        )}
        
        {/* Attachment Box */}
        {isAttachmentOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-2 w-64 bg-gray-800 rounded-lg shadow-lg p-3 grid grid-cols-4 gap-4"
          >
            <div className="flex flex-col items-center text-sm text-white">
              <FaImage className="text-blue-500 text-xl" />
              <span>Gallery</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaCamera className="text-pink-500 text-xl" />
              <span>Camera</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaMapMarkerAlt className="text-green-500 text-xl" />
              <span>Location</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaUser className="text-blue-600 text-xl" />
              <span>Contact</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaFileAlt className="text-purple-500 text-xl" />
              <span>Document</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaHeadphones className="text-orange-500 text-xl" />
              <span>Audio</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaPoll className="text-yellow-500 text-xl" />
              <span>Poll</span>
            </div>
            <div className="flex flex-col items-center text-sm text-white">
              <FaMagic className="text-indigo-500 text-xl" />
              <span>Imagine</span>
            </div>
          </motion.div>
        )}

        <button className="w-10 ml-2" onClick={() => setIsEmojiPickerOpen((prev) => !prev)}>
          <BsEmojiSmile />
        </button>
        <button className="w-10" onClick={() => setIsAttachmentOpen((prev) => !prev)}>
          <TiAttachment style={{ width: "1.5rem", height: "1.5rem" }} />
        </button>
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg outline-none bg-gray-800 text-white"
          placeholder="Type a message..."
          ref={inputMessageRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        
        {/* Send/Audio Button */}
        <button
          className="ml-4 p-2 bg-blue-700 text-white rounded-full"
          onClick={message.trim() ? sendMessage : handleAudio}
        >
          {message.trim() ? <IoSend className="text-xl" /> : <FaMicrophone className="text-xl" />}
        </button>
      </div>
    </>
  );
};

export default Conversation;
