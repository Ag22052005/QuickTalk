// useAddContacts.js
import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContextProvider";

const useAddContacts = (setToggleAddContact) => {
  const { socket } = useContext(SocketContext);
  const token = localStorage.getItem("authToken");
  const { setContacts } = useAuthContext();
  const nameRef = useRef(null);
  const numberRef = useRef(null);

  const handleAddContactBtn = () => {
    let name = nameRef.current.value;
    let number = numberRef.current.value;

    if (name.trim() !== "" && number.trim() !== "") {
      if (number.length !== 10) return toast.error("Enter the 10 Digit Contact Number");

      axios.post(
        `${import.meta.env.VITE_SERVER_URL}/addContact`,
        { contactName: name, contactNumber: number },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then(() => {
        setToggleAddContact(prev => !prev);
      })
      .catch(error => {
        if (error.response && error.response.data === "The Contact is Already there in your chatList") {
          toast.error("Contact already exists");
        } else {
          console.log("add to contact error", error);
          toast.error("Internal Server Error");
        }
      });
    } else {
      toast.error("Add the Credentials Carefully");
    }
  };

  useEffect(() => {
    socket?.on("newContact", (newContact) => {
      setContacts(prev => [...prev, newContact]);
    });

    axios.get(`${import.meta.env.VITE_SERVER_URL}/userDetails`, {
      headers: { authorization: `bearer ${token}` },
    })
    .then(res => {
      // console.log("userDetails : ", res.data);
      setContacts(res.data.contacts);
    })
    .catch(error => {
      console.log("userDetails error", error);
      toast.error("Internal Server Error");
    });
  }, [setContacts, token]);

  return { nameRef, numberRef, handleAddContactBtn };
};

export default useAddContacts;
