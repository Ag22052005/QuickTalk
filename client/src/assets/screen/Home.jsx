import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import ConversationArea from "../components/ConversationArea";
import { ChatContext } from "../../context/ChatContextProvider";
import { SocketContext } from "../../context/SocketContextProvider";
import useInitializeSocket from "../hooks/useInitializeSocket"
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
function Home() {
  const {currentReceiver} = useContext(ChatContext)
  const {authUser} = useContext(authContext)
  const {setSocket,setOnlineUsers} = useContext(SocketContext)
  const navigate = useNavigate()
  const[roomId, setRoomId] = useState(null)
  useInitializeSocket(authUser, setSocket, setOnlineUsers,roomId,setRoomId);

  useEffect(()=>{
    if(roomId){
      navigate(`/video-call/${roomId}`)
    }
  },[roomId])
  // console.log("currentReceiver in home ",currentReceiver)
  return (
    <div className="artboard rounded-lg m-auto w-[80vw] h-[100vh] flex homeScreen bg-black border-2">
      <SideBar />
      <ConversationArea/>
    </div>
  );
}

export default Home;
