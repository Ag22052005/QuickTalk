import { createContext, useContext, useState } from "react";

export const ChatContext = createContext({
  currentReceiver:{},
  setCurrentReceiver: () => {},
  status: "offline",
  setStatus: () => {},
  currentConversation: [],
  setCurrentConversation: () => {},
  chatLoader:false,
  setChatLoader:()=>{},
  videoCallSender:{},
  setVideoCallSender:()=>{},
});

export const useChatContext = ()=>{
  const context = useContext(ChatContext);
    if (!context) {
      throw new Error(
        "useChatContext must be used within an ChatContextProvider"
      );
    }
    return context;
}

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
