import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const useSignup =() => {
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const signup = ({name,phoneNumber,password})=>{

    setLoading(true)
    axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, {
      name,phoneNumber,password
    }).then((res)=>{
      console.log(res.data)
      localStorage.setItem('user',JSON.stringify(res.data.user))
      localStorage.setItem('authToken',res.data.authToken)
      setLoading(false)
      toast.success("Sign Up Successfully")
      navigate('/select-avatar');
    }).catch((error)=>{
      setLoading(false)
      console.log("sign Up error ",error)
      toast.error("Sign Up Failed")
    })
    

  }
  return {loading,signup}
  
};
export default useSignup