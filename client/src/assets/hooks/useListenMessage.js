import { useContext, useEffect } from "react"
import { SocketContext } from "../../context/SocketContextProvider"
import { ChatContext } from "../../context/ChatContextProvider"


const useListenMessage = () => {
  const { socket } = useContext(SocketContext);
  const { currentConversation, setCurrentConversation } = useContext(ChatContext);

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      setCurrentConversation(prev => [...prev, newMessage]);
      console.log("listening to newMessage: ", newMessage);
    });

    // Cleanup listener
    return () => socket?.off('newMessage');
  }, [socket, setCurrentConversation]);
};

export default useListenMessage