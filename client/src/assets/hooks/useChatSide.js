import { useState,useEffect } from 'react';


const useChatSide = (authUser,message) => {
  const [chatSide, setChatSide] = useState("")
  useEffect(() => {
    if (authUser?._id) {
      if (message.senderId === authUser._id) {
        setChatSide("chat-end");
      } else {
        setChatSide("chat-start");
      }
    }
  }, [message.senderId, authUser]);

  return chatSide;
}

export default useChatSide