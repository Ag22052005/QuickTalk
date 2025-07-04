import { createContext, useState } from "react";

import { useAuthContext } from "./AuthContext"; 


export const SocketContext = createContext({});

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <SocketContext.Provider value={{ socket,setSocket, onlineUsers,setOnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
