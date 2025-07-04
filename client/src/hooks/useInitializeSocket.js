import { useEffect } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import peer from "../services/peer";
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContextProvider";
import { authContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContextProvider";

const useInitializeSocket = (
  authUser, setOnlineUsers, roomId, setRoomId) => {
  const {socket,setSocket} = useContext(SocketContext)
  const { contacts, setContacts } = useContext(authContext);
  const { setCurrentReceiver } = useContext(ChatContext);
  // console.log("contacts in useinitialize", contacts);
  useEffect(() => {
    if (authUser) {
      const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
        query: {
          userId: authUser?._id,
        },
      });
      setSocket(socket);
      // console.log("contacts in useintialize", contacts);
      const incomingVideoCallHandler = async ({
        callerId,
        roomId,
        receiverId,
        offer,
      }) => {
        // console.log("incomming video call from ", callerId, "in room ", roomId);
        // console.log("offer", offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("join-video-call", { callerId, roomId, receiverId, ans });
        // onIncomingCallNavigate(roomId);
        setRoomId(roomId);
        // console.log("contacts in incommingvideocallhandler", contacts);
        const receiverContact = contacts.find(
          (contact) => contact.userId._id == callerId
        );
        console.log(
          "setting current receiver in receiver for videocall",
          receiverContact,
          "caller id ",
          callerId
        );
        setCurrentReceiver(receiverContact);
      };
      const joinedVideoCallHandler = async ({
        callerId,
        roomId,
        receiverId,
        ans,
      }) => {
        console.log("ans in joinedvideocallhandler", ans);
        await peer.setRemoteDescription(ans);
        console.log("user-joined");
        toast.success("user-joined");
      };

      const getOnlineUsersHandler = (res) => {
        setOnlineUsers(res);
      };
      socket.on("connect", () => {
        console.log("connected", socket.id);
      });
      socket.on("incoming-video-call", incomingVideoCallHandler);
      socket.on("joined-video-call", joinedVideoCallHandler);
      socket.on("getOnlineUsers", getOnlineUsersHandler);

      // socket.onAny((event, ...args) => {
      //   console.log("📡 [Socket Event]", event, args);
      // });
      return () => {
        socket.off("incoming-video-call", incomingVideoCallHandler);
        socket.off("getOnlineUsers", getOnlineUsersHandler);
        socket.off("joined-video-call", joinedVideoCallHandler);
      };
    }
  }, [contacts]);

  useEffect(() => {
    socket?.on("newContact", (contacts, phoneNumber) => {
      toast.success("you are added by", phoneNumber);
      setContacts(contacts);
    });
  }, []);

  return { roomId };
};

export default useInitializeSocket;
