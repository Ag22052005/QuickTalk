import React, { useContext } from "react";
import { ChatContext } from "@/context/ChatContextProvider";
import Greeting from "./Greeting";
import Conversation from "./Conversation";

function ConversationArea() {
  const { currentReceiver } = useContext(ChatContext);

  return (
    <div
      className={`flex flex-col h-full w-auto md:w-[65%] ml-1 rounded-lg shadow-lg overflow-hidden 
        border border-muted bg-white dark:bg-zinc-900 transition-all duration-300 
        ${currentReceiver ? "" : "hidecontainer"}`}
    >
      {currentReceiver ? <Conversation /> : <Greeting />}
    </div>
  );
}

export default ConversationArea;
