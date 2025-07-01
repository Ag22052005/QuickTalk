import React from 'react'
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContextProvider';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useFetchChats = () => {
  const {setChatLoader,chatLoader,setCurrentConversation,currentReceiver,status} = useContext(ChatContext);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    console.log("fetching chats....")
    setCurrentConversation([])
    setChatLoader(true)
    if (currentReceiver != null && currentReceiver != "") {
      // console.log(currentReceiver)
      fetchChats()
  }}, [currentReceiver, status]);

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
          setCurrentConversation(res.data.messages);
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