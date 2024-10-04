import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

export const SocketContext = createContext({});

export const SocketContextProvider = ({ children }) => {
  const { authUser } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = localStorage.getItem("authToken");
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
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
