import { useContext } from "react";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";

const useGetContacts = () => {
  const token = localStorage.getItem("authToken");
  const {setContacts} = useAuthContext()

  const getContact = async () => {
    // console.log("getcontacts")
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/get-contacts`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        const contacts = res.data.contacts;
        // console.log("contacts fetched",contacts)
        setContacts(contacts);
      })
      .catch((error) => {
        console.log("error in get contacts")
      });
  };

  return { getContact };
};

export default useGetContacts;
