import React, { useContext } from "react";
import { useChatContext } from "@/context/ChatContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useTabSwitchContext } from "@/context/TabSwitchContextProvider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dp from "@/assets/images/dp.png";

function Contact({ contact }) {
  const { setCurrentReceiver, currentReceiver } = useChatContext();
  const { onlineUsers } = useSocketContext();
  const { setCurrentTab } = useTabSwitchContext();

  const isOnline = onlineUsers.includes(contact?.userId?._id);
  const isSelected = currentReceiver?.userId?._id === contact?.userId?._id;

  const handleClick = () => {
    setCurrentReceiver(contact);
    setCurrentTab("chat");
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-colors",
        isSelected
          ? "bg-muted dark:bg-zinc-900"
          : "hover:bg-muted dark:hover:bg-zinc-800"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-[50px] h-[50px]">
          {isOnline && (
            <span className="absolute">
              <Badge className="rounded-full bg-green-500 hover:bg-green-500 p-1 w-3 h-3" />
            </span>
          )}
          <img
            src={contact.userId.profilePic || dp}
            alt="User"
            className="w-full h-full object-cover rounded-full border border-border"
          />
        </div>
        <div className="text-foreground text-lg font-medium truncate max-w-[180px] sm:max-w-[250px]">
          {contact.contactName || contact.userId?.phoneNumber}
        </div>
      </div>
    </div>
  );
}

export default Contact;
