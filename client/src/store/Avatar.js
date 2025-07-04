import axios from "axios";
import { useAuthContext } from "@/context/AuthContext"; 
import toast from "react-hot-toast";



export const updateAvatar = (avatarUrl) => {
  const token = localStorage.getItem("authToken");
  const { authUser, setAuthUser } = useAuthContext();
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
    })
    .catch((err) => {
      console.log(err.message);
      toast.error(err.message);
    });
};
