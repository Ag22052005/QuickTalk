import axios from "axios";
import { createContext, useContext, useState } from "react";

export const authContext = createContext();

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

import useFetchUser from "../assets/hooks/useFetchUser";
const AuthContextProvider = ({ children }) => {
  const [fetchAuthUser,setFetchAuthUser] = useState(false)
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [contacts, setContacts] = useState(authUser?.contacts || []);
  useFetchUser(authUser,fetchAuthUser,setContacts)
  return (
    <authContext.Provider value={{ authUser, setAuthUser,contacts,setContacts,fetchAuthUser,setFetchAuthUser }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
