import React from 'react'

const MessageSkeleton = ({chatSide}) => {
  return (
    (
      <div className={`chat ${chatSide}`}>
        {/* Avatar Skeleton */}
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
        </div>

        {/* Message Bubble Skeleton */}
        <div className="w-[50%]">
          <div
            className={`chat-bubble pb-6 ${
              chatSide === "chat-end" ? "bg-gray-800" : "bg-gray-900"
            } min-w-full animate-pulse`}
          >
            {/* Simulated text */}
            <div className="h-4 w-2/3 bg-gray-600 rounded my-2"></div>
            <div className="h-4 w-1/2 bg-gray-600 rounded"></div>

            {/* Timestamp Placeholder */}
            <div className="text-xs opacity-50 float-right text-gray-500 w-8 h-4 bg-gray-700 rounded mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  )
}

export default MessageSkeleton