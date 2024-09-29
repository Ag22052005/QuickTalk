import React from "react";
import SideBar from "../components/SideBar";
import ConversationArea from "../components/ConversationArea";
import { useTabSwitchContext } from "../../context/TabSwitchContext";

function Home() {
  const{currentTab,setCurrentTab} = useTabSwitchContext()
  console.log("currentTab in home",currentTab)
  return (
    <div className="artboard border-2 rounded-lg m-auto w-[80vw] h-[98vh] flex">
      <SideBar className ={`${currentTab == 'sidebar'?"":"hide-container"}`} />
      <ConversationArea className ={`${currentTab == 'sidebar'?"hide-container":""}`} />
    </div>
  );
}

export default Home;
