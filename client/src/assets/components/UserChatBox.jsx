import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContextProvider";
import { FaCircle } from "react-icons/fa";
import { SocketContext } from "../../context/SocketContextProvider";
import { convertToIST } from "./Message";
import { useTabSwitchContext } from "../../context/TabSwitchContext";
import dp from "../images/dp.png"
function UserChatBox({ contact }) {
  const { setCurrentReceiver,currentReceiver} = useContext(ChatContext);
  const { onlineUsers } = useContext(SocketContext);
  const isOnline = onlineUsers.includes(contact.userId._id);
  const{setCurrentTab} = useTabSwitchContext()
  const currentContact= currentReceiver?.userId._id === contact.userId._id
  // console.log("current contact for ",currentReceiver,contact,currentContact)
  const handleCurrentReceiver = () => {
    setCurrentReceiver(contact);
    setCurrentTab('chat');
  };
  // console.log("userchatbox", contact);
  // console.log("userchatbox Online users", onlineUsers);
  // console.log("CurrentConversation in userchatbox", currentConversation);
  return (
    <div
      className={` w-full flex justify-between my-3 rounded-tl-3xl rounded-bl-3xl ${currentContact?"bg-zinc-900":"hover:bg-zinc-800"} `}
      onClick={handleCurrentReceiver}
    >
      <div className="flex ">
        <div className="img">
          {isOnline ? <FaCircle className="fixed text-green-500" /> : null}
          <img
            src={contact.userId.profilePic || dp}
            alt=""
            className="w-[50px] h-[50px] object-cover rounded-full"
          />
        </div>
        <div className="flex justify-center items-center mx-3 text-xl">
          {contact.contactName}
        </div>
      </div>
    </div>
  );
}

export default UserChatBox;
