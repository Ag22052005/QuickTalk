import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext()
  const login = ({ phoneNumber, password }) => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/login`, {
        phoneNumber,
        password,
      })
      .then((res) => {
        setLoading(false);
        toast.success("Logged In Successfully");
        console.log("authUser : ", res.data.user);
        
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAuthUser(res.data.user)
        localStorage.setItem("authToken", res.data.authToken);
        console.log("navigating to /");
      })
      .catch((error) => {
        setLoading(false);
        console.log("Login error ", error);
        toast.error(error.response.data.errmsg);
      });
  };
  return { loading, login };
};
export default useLogin;
