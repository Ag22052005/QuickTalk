import axios from "axios";
import { useChatContext } from "@/context/ChatContextProvider";
import { useState } from "react";
import {toast} from "sonner";

const useSendMessage = (message, setMessage) => {
  const token = localStorage.getItem("authToken");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { currentConversation, setCurrentConversation, currentReceiver } =
    useChatContext()

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleAudio = () => {
    console.log("Audio recording feature triggered.");
  };

  const handleDocumentChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setSelectedDocument(file); // Set the selected document
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_URL}/send/${
            currentReceiver.userId._id
          }`,
          { message: message.trim(), document: selectedDocument }, // Include the document if present
          { headers: { authorization: `bearer ${token}` } }
        )
        .then((res) => {
          const newMessage = res.data;
          setCurrentConversation([...currentConversation, newMessage]);
          setMessage("");
          setSelectedDocument(null); // Clear the document after sending
        })
        .catch((error) => {
          console.log("send msg error", error);
          toast.error("Error :", error.message);
        });
    }
  };
  return { sendMessage, handleEmojiClick, handleAudio, handleDocumentChange };
};

export default useSendMessage;
