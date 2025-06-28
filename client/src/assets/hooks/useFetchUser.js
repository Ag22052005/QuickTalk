import { useEffect } from 'react';
import axios from 'axios'


const useFetchUser = (authUser,fetchAuthUser,setContacts) => {
    const token = localStorage.getItem("authToken");
  useEffect(()=>{
    // console.log("fetching contacts .......")
    if(authUser)
    fetchUser()
  },[authUser,fetchAuthUser])
  // console.log("contacts in Authcontext :  ", contacts)
  
  const fetchUser =()=>{
    axios.get(
      `${import.meta.env.VITE_SERVER_URL}/getcontacts`,
      { headers: { authorization: `bearer ${token}` } }
    ).then(res => { 
      const user = res.data;
      // console.log("user.contacts :",user.contacts)
      setContacts(user.contacts)
    })
  }
}

export default useFetchUser