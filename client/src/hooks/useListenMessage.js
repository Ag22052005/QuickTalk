import { useContext, useEffect } from "react";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useChatContext } from "@/context/ChatContextProvider";
import chatmsgaudio from '../assets/audios/chatmsgaudio.mp3'
const useListenMessage = () => {
  const { socket } = useSocketContext();
  const { setCurrentConversation } = useChatContext();
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
