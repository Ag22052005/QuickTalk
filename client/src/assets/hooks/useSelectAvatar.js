import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
const useSelectAvatar = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const { authUser, setAuthUser } = useAuthContext();
  const updateAvatar = (avatarUrl) => {
    // console.log(avatarUrl)
    axios
      .patch(
        `${import.meta.env.VITE_SERVER_URL}/updateAvatar`,
        { phoneNumber: authUser.phoneNumber, url: avatarUrl },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        const updatedUser = res.data;
        setAuthUser(updatedUser);
      }).catch((err)=>{
        console.log(err.message)
        toast.error(err.message)
      });
  };

  return { loading, updateAvatar };
};

export default useSelectAvatar;
