import axios from "axios";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { IoCall } from "react-icons/io5";
function AddContact({ setToggleAddContact }) {
  const token = localStorage.getItem("authToken")
  const nameRef = useRef(null);
  const numberRef = useRef(null);
  const handleAddContactBtn = () => {
    let name = nameRef.current.value;
    let number = numberRef.current.value;
    if (name.trim() != "" && number.trim() != "") {
      if (number.length != 10)
        return toast.error("Enter the 10 Digit Contact Number");
      axios.post(
        `${import.meta.env.VITE_SERVER_URL}/addContact`,
        {
          contactName: name,
          contactNumber: number,
        },
        {
          headers: {
            authorization: `bearer ${token}`,
          },
        }
      ).then((res)=>{
        setToggleAddContact(p => !p)
      }).catch((error)=>{
        console.log("add to contact error", error)
        toast.error("Internal Server Error")
      })
    } else {
      toast.error("Add the Credentials Carefully");
    }
  };
  return (
    <div className="px-10 py-4 border-2 border-gray-600 rounded-2xl">
      <h1 className="my-4 mx-auto">Add To Contact</h1>
      <label className="input input-bordered flex items-center my-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70 mr-2"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Username"
          ref={nameRef}
        />
      </label>
      <label className="input input-bordered flex items-center my-2">
        <IoCall className="mr-2" />
        <input
          type="text"
          className="grow"
          placeholder="Contact Number"
          ref={numberRef}
        />
      </label>
      <button className="btn btn-success w-full" onClick={handleAddContactBtn}>
        Success
      </button>
    </div>
  );
}

export default AddContact;
