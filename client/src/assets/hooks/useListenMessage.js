import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContextProvider";
import { ChatContext } from "../../context/ChatContextProvider";
import chatmsgaudio from '../audios/chatmsgaudio.mp3'
const useListenMessage = () => {
  const { socket } = useContext(SocketContext);
  const { setCurrentConversation } = useContext(ChatContext);
  const audio = new Audio(chatmsgaudio);
    function playAudio() {
      audio.play();
    }
  useEffect(() => {
    const newMessageHandler = (newMessage) => {
      setCurrentConversation((prev) => [...prev, newMessage]);
      playAudio();
    }
    socket?.on("newMessage", newMessageHandler);

    // Cleanup listener
    return () => socket?.off("newMessage",newMessageHandler);
  }, [socket, setCurrentConversation]);
};

export default useListenMessage;
