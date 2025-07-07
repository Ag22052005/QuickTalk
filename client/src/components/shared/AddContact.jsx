import React from "react";
import { IoCall } from "react-icons/io5";
import { User } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import useAddContacts from "@/hooks/useAddContacts";

function AddContact({ setToggleAddContact }) {
  const { nameRef, numberRef, handleAddContactBtn, addContactLoading } = useAddContacts(setToggleAddContact);

  return (
    <div className="w-full max-w-md p-6 rounded-2xl border bg-background shadow-md mx-auto mt-4">
      <h1 className="text-2xl font-bold text-center mb-4">Add Contact</h1>

      {/* Username */}
      <div className="mb-4">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter name"
          ref={nameRef}
          className="mt-1"
        />
      </div>

      {/* Contact Number */}
      <div className="mb-4">
        <Label htmlFor="contact" className="flex items-center gap-2">
          <IoCall className="w-4 h-4" />
          Contact Number
        </Label>
        <Input
          id="contact"
          type="text"
          placeholder="Enter phone number"
          ref={numberRef}
          className="mt-1"
        />
      </div>

      {/* Submit Button */}
      <Button className="w-full mt-2" onClick={handleAddContactBtn} disabled={addContactLoading}>
        {addContactLoading ? (
          <ThreeDots
            visible={true}
            height="20"
            width="40"
            color="#ffffff"
            radius="2"
            ariaLabel="three-dots-loading"
          />
        ) : (
          "Add"
        )}
      </Button>
    </div>
  );
}

export default AddContact;
