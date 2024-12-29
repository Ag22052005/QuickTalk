import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContextProvider";
import { FaCircle } from "react-icons/fa";
import { SocketContext } from "../../context/SocketContextProvider";
import { convertToIST } from "./Message";
import { useTabSwitchContext } from "../../context/TabSwitchContext";

function UserChatBox({ contact }) {
  const { setCurrentReceiver,currentReceiver, currentConversation } = useContext(ChatContext);
  const { onlineUsers } = useContext(SocketContext);
  const isOnline = onlineUsers.includes(contact.userId);
  const{currentTab,setCurrentTab} = useTabSwitchContext()
  const currentContact= currentReceiver?.userId == contact.userId
  const handleCurrentReceiver = () => {
    setCurrentReceiver(contact);
    setCurrentTab('chat');
  };
  // console.log("userchatbox", contact);
  // console.log("userchatbox Online users", onlineUsers);
  // console.log("CurrentConversation in userchatbox", currentConversation);
  return (
    <li
      className={` w-full flex justify-between my-3 rounded-tl-3xl rounded-bl-3xl ${currentContact?"bg-zinc-900":"hover:bg-zinc-800"} `}
      onClick={handleCurrentReceiver}
    >
      <div className="flex ">
        <div className="img">
          {isOnline ? <FaCircle className="fixed text-green-500" /> : null}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt=""
            className="w-[50px] h-[50px] object-cover"
          />
        </div>
        <div className="flex justify-center items-center mx-3 text-xl">
          {contact.contactName}
        </div>
      </div>
      {/* <div className="flex justify-center items-center mr-4">

      </div> */}
    </li>
  );
}

export default UserChatBox;
