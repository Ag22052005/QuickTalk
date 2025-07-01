import { createContext, useContext, useEffect, useState } from "react";

export const authContext = createContext();

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

const AuthContextProvider = ({ children }) => {
  const [fetchAuthUser,setFetchAuthUser] = useState(false)
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [contacts, setContacts] = useState(authUser?.contacts || []);
  // useEffect(()=>{
  //   console.log("authUser",authUser)
  //   console.log("contacts",contacts)
  // },[authUser,contacts])
  return (
    <authContext.Provider value={{ authUser, setAuthUser,contacts,setContacts,fetchAuthUser,setFetchAuthUser }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
