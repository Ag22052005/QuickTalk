import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";

export default function () {
  const { authUser } = useAuthContext();

  return (
    <div className="w-full h-full flex justify-center items-center border-l border-muted bg-white dark:bg-black px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          👋👋 {authUser?.name}
        </h1>
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          Select to Start conversation
          <MdOutlineMarkUnreadChatAlt className="text-green-500 text-3xl sm:text-4xl" />
        </h2>
      </div>
    </div>
  );
}
