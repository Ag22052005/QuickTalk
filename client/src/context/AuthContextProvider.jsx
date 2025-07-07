import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => {},
  contacts: [],
  setContacts: () => {},
  fetchAuthUser: false,
  setFetchAuthUser: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

const AuthContextProvider = ({ children }) => {
  const [fetchAuthUser, setFetchAuthUser] = useState(false);
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [contacts, setContacts] = useState([]);
  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        contacts,
        setContacts,
        fetchAuthUser,
        setFetchAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
