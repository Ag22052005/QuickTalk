import React, { useContext, useEffect, useState } from "react";
import SideBar from "@/components/shared/SideBar";
import ConversationArea from "@/components/shared/ConversationArea";
import { ChatContext } from "@/context/ChatContextProvider";
import { SocketContext } from "@/context/SocketContextProvider";
import useInitializeSocket from "@/hooks/useInitializeSocket";
import { authContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function Home() {
  const { currentReceiver } = useContext(ChatContext);
  const { authUser } = useContext(authContext);
  const { setSocket, setOnlineUsers } = useContext(SocketContext);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useInitializeSocket(authUser, setOnlineUsers, roomId, setRoomId);

  useEffect(() => {
    if (roomId) {
      navigate(`/video-call/${roomId}`);
    }
  }, [roomId]);

  // optional: apply dark mode globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="relative w-full h-screen">
      {/* Toggle switch at absolute top-right of screen */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Label htmlFor="mode-switch" className="text-white dark:text-gray-200">
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </Label>
        <Switch
          id="mode-switch"
          checked={darkMode}
          onCheckedChange={(val) => setDarkMode(val)}
        />
      </div>

      {/* Main content */}
      <div className="artboard rounded-lg m-auto w-[80vw] h-[100vh] flex homeScreen bg-background border border-border">
        <SideBar />
        <ConversationArea />
      </div>
    </div>
    
  );
}

export default Home;
