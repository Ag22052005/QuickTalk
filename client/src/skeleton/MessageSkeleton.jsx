import React from 'react';

const MessageSkeleton = ({ chatSide }) => {
  const isSender = chatSide === 'chat-end';

  return (
    <div className={`chat ${chatSide}`}>
      {/* Avatar Skeleton */}
      <div className="chat-image avatar">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
      </div>

      {/* Message Bubble Skeleton */}
      <div className="w-[50%]">
        <div
          className={`chat-bubble pb-6 ${
            isSender ? "bg-muted" : "bg-muted"
          } min-w-full animate-pulse`}
        >
          {/* Simulated text lines */}
          <div className="h-4 w-2/3 bg-gray-400/30 dark:bg-gray-600/40 rounded my-2"></div>
          <div className="h-4 w-1/2 bg-gray-400/30 dark:bg-gray-600/40 rounded"></div>

          {/* Timestamp Placeholder */}
          <div className="text-xs opacity-50 float-right text-muted-foreground w-8 h-4 bg-gray-400/30 dark:bg-gray-600/40 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
