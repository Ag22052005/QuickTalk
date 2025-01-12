import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ChatContext = createContext({
  currentReceiver:"",
  setCurrentReceiver:()=>{},
  status:"",
  setStatus:()=>{},
  currentConversation:[],
  setCurrentConversation:()=>{}
})

export const ChatContextProvider=({children})=>{
  const [currentReceiver,setCurrentReceiver] = useState(null)
  const [status,setStatus] = useState("offline")
  const [currentConversation,setCurrentConversation] = useState([])
  const token = localStorage.getItem("authToken");
  useEffect(()=>{
    if(currentReceiver!=null && currentReceiver!=""){
      console.log("currentReceiver in chatContextProvider" ,currentReceiver)
      axios.get(`${import.meta.env.VITE_SERVER_URL}/get-chats/${currentReceiver.userId._id}`,{
        headers:{
          authorization:`bearer ${token}`
        },
      }).then((res)=>{  
        // console.log("getchat : ",res.data)
        setCurrentConversation(res.data.messages)
      }).catch((error)=>{
        console.log("get-chat error" , error)
        toast.error("Internal Server Error")
      })

    }
  },[currentReceiver,status])
  return(
    <ChatContext.Provider value={{currentReceiver,setCurrentReceiver,status,setStatus,currentConversation,setCurrentConversation}}>
      {children}
    </ChatContext.Provider>
  )
}