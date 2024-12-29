import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
export default function () {
  const {authUser} = useAuthContext()
  console.log(authUser)
  return (
    <div className='bg-black w-full h-full flex justify-center items-center border-l-2'>
      <div className='flex flex-col items-center gap-4'>
      <h1 className=' text-6xl font-extrabold'> 👋👋 {authUser.name }</h1>
      <h1 className='font-extrabold text-2xl'>Select to Start conversation <MdOutlineMarkUnreadChatAlt style={{display:'inline',color:'green'}} className='text-4xl' /></h1>
      </div>
    </div>
  )
}
