import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContextProvider";
import { ChatContext } from "../../context/ChatContextProvider";
import chatmsgaudio from '../audios/chatmsgaudio.mp3'
const useListenMessage = () => {
  const { socket } = useContext(SocketContext);
  const { currentConversation, setCurrentConversation } = useContext(ChatContext);
  const audio = new Audio(chatmsgaudio);
    function playAudio() {
      audio.play();
    }
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setCurrentConversation((prev) => [...prev, newMessage]);
      playAudio();
    });

    // Cleanup listener
    return () => socket?.off("newMessage");
  }, [socket, setCurrentConversation]);
};

export default useListenMessage;
