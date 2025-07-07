import { useChatContext } from '@/context/ChatContextProvider';
import { useEffect } from 'react';
import axios from 'axios';
import {toast} from "sonner";

const useFetchChats = () => {
  const {setChatLoader,chatLoader,setCurrentConversation,currentReceiver,status} = useChatContext();
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    // console.log("fetching chats....")
    setCurrentConversation([])
    setChatLoader(true)
    if (currentReceiver != null && currentReceiver != "") {
      // console.log(currentReceiver)
      fetchChats()
  }}, [currentReceiver]);

  const fetchChats = ()=>{
    axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/get-chats/${
            currentReceiver.userId._id
          }`,
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log("getchat : ",res.data)
          const currentConversation = res.data.messages
          setCurrentConversation(currentConversation);
        })
        .catch((error) => {
          console.log("get-chat error", error);
          toast.error("Internal Server Error");
        }).finally(
          ()=>{
            setChatLoader(false)
          }
        );
    }
}

export default useFetchChats