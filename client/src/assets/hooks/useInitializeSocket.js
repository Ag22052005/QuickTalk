import { useEffect } from 'react';
import { io } from "socket.io-client";

const useInitializeSocket = (authUser,setSocket,setOnlineUsers) => {
  
  useEffect(() => {
    if (authUser) {
      const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
        query: {
          userId: authUser?._id,
        },
      });
      setSocket(socket);

      socket.on("connect",() => {
        console.log("connected", socket.id);
      })
      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });
      return () => socket.close();
    }
  }, [authUser]);
}

export default useInitializeSocket