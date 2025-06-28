import { createContext, useState } from "react";

import { useAuthContext } from "./AuthContext";
import useInitializeSocket from "../assets/hooks/useInitializeSocket";

export const SocketContext = createContext({});

export const SocketContextProvider = ({ children }) => {
  const { authUser } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useInitializeSocket(authUser,setSocket,setOnlineUsers)
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
