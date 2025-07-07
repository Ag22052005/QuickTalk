import React, { useEffect, useState } from "react";
import SideBar from "@/components/shared/SideBar";
import ConversationArea from "@/components/shared/ConversationArea";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContextProvider";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useChatContext } from "@/context/ChatContextProvider";
import { toast } from "sonner";
import peer from "@/services/peer";
import IncomingCallModal from "@/components/shared/IncomingCallModal";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const { contacts,authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const [ incomingCall, setIncomingCall ] = useState(null);
  const { setCurrentReceiver } = useChatContext();
  // useEffect(() => {
  //   if (roomId) {
  //     navigate(`/video-call/${roomId}`);
  //   }
  // }, [roomId]);

  // optional: apply dark mode globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  const handleAccept = async () => {
    if (!incomingCall) return;
    // console.log("call accepted")
    const ans = await peer.getAnswer(incomingCall.offer);
    // console.log("offer is set")
    socket.emit("join-video-call", {
      callerId: incomingCall.callerId,
      receiverId: authUser._id,
      roomId: incomingCall.roomId,
      ans,
    });
    const receiverContact = contacts.find(
      (contact) => contact.userId._id === incomingCall.callerId
    );
    setCurrentReceiver(receiverContact);
    navigate(`/video-call/${incomingCall.roomId}`);
    setIncomingCall(null);
  };

  const handleReject = () => {
    // Optional: emit "call-rejected" to caller
    socket.emit("call-rejected", {
      callerId: incomingCall?.callerId,
      receiverId: authUser._id,
      roomId: incomingCall?.roomId,
    });
    setIncomingCall(null);
  };

  useEffect(() => {
  if (socket) {
    const incomingVideoCallHandler = async ({
      callerId,
      roomId,
      receiverId,
      offer,
    }) => {
      const receiverContact = contacts.find(
        (contact) => contact.userId._id == callerId
      );
      setIncomingCall({
        callerId,
        roomId,
        offer,
        callerName: receiverContact?.userId?.fullName || "Unknown",
      });
    };

    const joinedVideoCallHandler = async ({ ans }) => {
      await peer.setRemoteDescription(ans);
      toast.success("User joined");
    };

    socket.on("incoming-video-call", incomingVideoCallHandler);
    socket.on("joined-video-call", joinedVideoCallHandler);

    return () => {
      socket.off("incoming-video-call", incomingVideoCallHandler);
      socket.off("joined-video-call", joinedVideoCallHandler);
    };
  }
}, [contacts, socket]);


  return (
    <div className="flex flex-col">
      <div className="z-50 flex items-center gap-2 self-end p-4 ">
        <Label htmlFor="mode-switch" className="text-white dark:text-gray-200">
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </Label>
        <Switch
          id="mode-switch"
          checked={darkMode}
          onCheckedChange={(val) => setDarkMode(val)}
        />
      </div>
      <div className="relative w-full">
        {incomingCall && (
          <IncomingCallModal
            callerName={incomingCall.callerName}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
        {/* Toggle switch at absolute top-right of screen */}

        {/* Main content */}
        <div className="artboard rounded-lg m-auto w-[80vw] h-[100vh] flex homeScreen bg-background border border-border">
          <SideBar />
          <ConversationArea />
        </div>
      </div>
    </div>
  );
}

export default Home;
