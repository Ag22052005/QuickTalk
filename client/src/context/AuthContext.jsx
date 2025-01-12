import axios from "axios";
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
  const token = localStorage.getItem("authToken");
  const [fetchAuthUser,setFetchAuthUser] = useState(false)
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [contacts, setContacts] = useState(authUser.contacts || []);
  useEffect(()=>{
    // console.log("fetching contacts .......")
    if(authUser)
    axios.get(
      `${import.meta.env.VITE_SERVER_URL}/getcontacts`,
      { headers: { authorization: `bearer ${token}` } }
    ).then(res => { 
      const user = res.data;
      console.log("user.contacts :",user.contacts)
      setContacts(user.contacts)
    })
  },[authUser,fetchAuthUser])
  // console.log("contacts in Authcontext :  ", contacts)

  return (
    <authContext.Provider value={{ authUser, setAuthUser,contacts,setContacts,fetchAuthUser,setFetchAuthUser }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
