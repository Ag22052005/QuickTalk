import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContextProvider";

export const SocketContext = createContext({
  socket: null,
  setSocket: () => {},
  onlineUsers: [],
  setOnlineUsers: () => {},
});

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within an SocketContextProvider"
    );
  }
  return context;
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`, {
        query: {
          userId: authUser?._id,
        },
      });
      setSocket(newSocket);
      newSocket?.on("connect", () => {
        console.log("connected", newSocket.id);
      });

      const getOnlineUsersHandler = (res) => {
      setOnlineUsers(res);
    };
    newSocket.on("getOnlineUsers", getOnlineUsersHandler);
      return () => {
        newSocket.disconnect();
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, onlineUsers, setOnlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};
