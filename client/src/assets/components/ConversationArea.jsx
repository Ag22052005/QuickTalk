import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContextProvider";
import Greeting from "./Greeting";
import Conversation from "./Conversation";
function ConversationArea() {
  const { currentReceiver } = useContext(ChatContext);

  return (
    <div className={`flex flex-col h-auto w-auto md:w-[65%] ml-1rounded-lg shadow-lg overflow-hidden conversationArea ${currentReceiver?"":"hidecontainer"}`}>
      {currentReceiver ? <Conversation /> : <Greeting />}
    </div>
  );
}

export default ConversationArea;
