import React from "react";
import { IoCall } from "react-icons/io5";
import useAddContacts from "../hooks/useAddContacts";
import {ThreeDots} from "react-loader-spinner"

function AddContact({ setToggleAddContact }) {
  const { nameRef, numberRef, handleAddContactBtn, addContactLoading } =
    useAddContacts(setToggleAddContact);

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
        {!addContactLoading ? (
          <p>ADD</p>
        ) : (
          <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="white"
            radius="2"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
      </button>
    </div>
  );
}

export default AddContact;
