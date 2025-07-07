import axios from "axios";
import { useState } from "react";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContextProvider";


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
      toast.success("Sign Up Successfully")
      setStatus(true)
      navigate('/');
    }).catch((error)=>{
        console.log("error in signup",error)
        if(error.response.data.errors){
          const errorArray = error.response.data.errors
          errorArray.forEach(err => {
            toast.error(err.msg)
          });
        }else if(error.response.data.status === "user-exists"){
          toast.error("User already Exist")
        }
        else{
          toast.error("Internal Serval Error")
        }
      // console.log("sign Up error ",error.response.data.errors)
      setStatus(false)
    }).finally(()=>{
      setLoading(false)
    })
  }
  return {loading,signup,status}
  
};
export default useSignup