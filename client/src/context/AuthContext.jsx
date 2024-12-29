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
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [contacts, setContacts] = useState(JSON.parse(localStorage.getItem("user"))?.contacts||[]);
  useEffect(()=>{
    setContacts(authUser?.contacts)
  },[authUser])
  // console.log("authUser in context :  ",authUser)

  return (
    <authContext.Provider value={{ authUser, setAuthUser,contacts,setContacts }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
