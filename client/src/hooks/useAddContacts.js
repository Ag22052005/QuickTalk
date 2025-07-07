import {useRef, useState } from "react";
import axios from "axios";
import {toast} from "sonner";
import { useAuthContext } from "@/context/AuthContextProvider";

const useAddContacts = (setToggleAddContact) => {
  const token = localStorage.getItem("authToken");
  const { setContacts} = useAuthContext();
  const nameRef = useRef(null);
  const numberRef = useRef(null);
  const [addContactLoading,setAddContactLoading] = useState(false)

  const handleAddContactBtn = () => {

    let name = nameRef.current.value;
    let number = numberRef.current.value;
    setAddContactLoading(true)

    if (name.trim() !== "" && number.trim() !== "") {
      if (number.length !== 10) return toast.error("Enter the 10 Digit Contact Number");
      axios.post(
        `${import.meta.env.VITE_SERVER_URL}/addContact`,
        { contactName: name, contactNumber: number },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        toast.success("Contact is added !!!")
        const contacts = res?.data?.user?.contacts
        setContacts(contacts)
        setToggleAddContact(prev => !prev);
      })
      .catch(error => {
        if (error.response && error.response.data.message === "Contact already exists in your chat list") {
          toast.error("Contact already exists");
        } else if (error.response && error.response.status === 404) {
          toast.error("User is not on QuickTalk");
        }else {
          toast.error("Something went wrong, please try again later");
        }
      });
    } else {
      toast.error("Add the Credentials Carefully");
    }
    setAddContactLoading(false)
  };

  return { nameRef, numberRef, handleAddContactBtn,addContactLoading };
};

export default useAddContacts;
