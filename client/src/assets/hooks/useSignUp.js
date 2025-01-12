import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";


const useSignup =() => {
  const [status,setStatus] = useState(false)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const {setAuthUser} = useAuthContext()
  const signup = ({name,phoneNumber,password})=>{

    setLoading(true)
    axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, {
      name,phoneNumber,password
    }).then((res)=>{
      console.log(res.data)
      localStorage.setItem('user',JSON.stringify(res.data.user))
      localStorage.setItem('authToken',res.data.authToken)
      setAuthUser(res.data.user)
      
      setStatus(true)
      toast.success("Sign Up Successfully")
      navigate('/');
    }).catch((error)=>{
      const errorArray = error.response.data.errors
      errorArray.forEach(err => {
        toast.error(err.msg)
      });
      console.log("sign Up error ",error.response.data.errors)
      
    })
    

  }
  return {loading,signup,status}
  
};
export default useSignup