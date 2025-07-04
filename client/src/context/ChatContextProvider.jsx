import { createContext, useState } from "react";

export const ChatContext = createContext({
  currentReceiver: "",
  setCurrentReceiver: () => {},
  status: "",
  setStatus: () => {},
  currentConversation: [],
  setCurrentConversation: () => {},
  chatLoader:"",
  setChatLoader:()=>{},
  videoCallSender:{},
  setVideoCallSender:()=>{},
});

export const ChatContextProvider = ({ children }) => {
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [status, setStatus] = useState("offline");
  const [currentConversation, setCurrentConversation] = useState([]);
  const [chatLoader, setChatLoader] = useState(false)
  const [videoCallSender,setVideoCallSender] = useState(null)
  
  return (
    <ChatContext.Provider
      value={{
        currentReceiver,
        setCurrentReceiver,
        status,
        setStatus,
        currentConversation,
        setCurrentConversation,
        chatLoader,
        setChatLoader,
        videoCallSender,
        setVideoCallSender,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
