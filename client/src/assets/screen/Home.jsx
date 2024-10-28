import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import ConversationArea from "../components/ConversationArea";
import { ChatContext } from "../../context/ChatContextProvider";
function Home() {
  const {currentReceiver} = useContext(ChatContext)
  console.log("currentReceiver in home ",currentReceiver)
  return (
    <div className="artboard border-2 rounded-lg m-auto w-[80vw] h-[99vh] flex homeScreen">
      <SideBar />
      <ConversationArea/>
    </div>
  );
}

export default Home;
