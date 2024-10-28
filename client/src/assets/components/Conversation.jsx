import React, { useContext, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import Message from "./Message";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { ChatContext } from "../../context/ChatContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import useListenMessage from "../hooks/useListenMessage";
import { useAuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContextProvider";
import { FaArrowLeft } from "react-icons/fa6";
const Conversation = () => {
  useListenMessage();
  const token = localStorage.getItem("authToken");
  const { currentConversation, setCurrentConversation, currentReceiver,setCurrentReceiver } =
    useContext(ChatContext);
  const { contacts } = useAuthContext();
  // console.log("Contacts : ", contacts);
  const lastMessageRef = useRef(null);
  const inputMessageRef = useRef(null);
  const {onlineUsers} = useContext(SocketContext)
  

  useEffect(() => {
    setTimeout(() => {
      // lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      lastMessageRef.current?.scrollIntoView();
      console.log("currentReceiver",currentReceiver)
    }, 100);

  }, [currentConversation]);

  const sendMessage = () => {
    if (inputMessageRef.current.value.trim() !== "") {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_URL}/send/${currentReceiver.userId}`,
          {
            message: inputMessageRef.current.value.trim(),
          },
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const newMessage = res.data;
          setCurrentConversation([...currentConversation, newMessage]);
          console.log(currentConversation);
        })
        .catch((error) => {
          console.log("send msg error", error);
          toast.error("Internal Server Error");
        });
      inputMessageRef.current.value = "";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white fixed z-50 w-[50.8%] backdrop-blur-md conversationHead">
        <div className="flex items-center space-x-3">
          <FaArrowLeft onClick={()=>{
            setCurrentReceiver(null)
            }}/>
          <div className="w-10 h-10 bg-gray-200 rounded-full"> 
            <img src="" alt="" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {currentReceiver.contactName}
            </h1>
            <p className="text-sm">{onlineUsers.includes(currentReceiver.userId)?"Online":"Offline"}</p>
          </div>
        </div>
        <MdMoreVert className="text-2xl cursor-pointer text-white" />
      </div>

      {/* Message Area */}
      <div className="flex-grow overflow-y-auto bg-gray-900 p-4 mt-14">
        <ul className="space-y-2">
          {currentConversation.map((message) => {
  console.log("currentConversation[currentConversation.length-1]",currentConversation?.[currentConversation.length-1].createdAt)
            return (
              <div key={message._id} ref={lastMessageRef}>
                <Message message={message} />
              </div>
            );
          })}
        </ul>
      </div>

      {/* Input Area */}
      <div className="flex items-center p-2 ">
        <div className="w-10 ml-2">
          <BsEmojiSmile />
        </div>
        <div className="w-10">
          <TiAttachment
            width={"2.5rem"}
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </div>
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg outline-none"
          placeholder="Type a message..."
          ref={inputMessageRef}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-4 p-2 bg-blue-700 text-white rounded-full"
          onClick={sendMessage}
        >
          <IoSend className="text-xl" />
        </button>
      </div>
    </>
  );
};

export default Conversation;
