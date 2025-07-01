import React, { useEffect, useRef, useState } from "react";
import peer from "../services/peer";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketContextProvider";
import { ChatContext } from "../../context/ChatContextProvider";
import { authContext } from "../../context/AuthContext";

const VideoCallPage = () => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { currentReceiver, videoCallSender } = useContext(ChatContext);
  const { authUser } = useContext(authContext);

  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      // Add each track to the peer connection
      for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
        console.log("adding tracks", track);
      }
    } catch (err) {
      console.error("Error accessing camera/microphone", err);
    }
  };

  const negotiationNeededHandler = async () => {
    if (!videoCallSender) {
      console.log("videocall sender", videoCallSender);
      console.log("i'm the initiator for negotiationneeded");
      const offer = await peer.getOffer();
      console.log("current receiver for receiver", currentReceiver);
      socket.emit("peer:nego:needed", {
        receiverId: authUser._id,
        senderId: currentReceiver?.userId?._id,
        offer,
      });
    }
  };

  const peerNegotiatingHandler = async ({ receiverId, senderId, offer }) => {
    console.log("creating offer in sender");
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { senderId, receiverId, ans });
  };
  const peerNegoFinalHandler = async ({ ans }) => {
    console.log("final negotiation in sender with ans ", ans);
    await peer.setRemoteDescription(ans);
  };

  useEffect(() => {
    getUserMediaStream();
  }, []);

  useEffect(() => {
    const handleTrackEvent = (ev) => {
      const remoteStream = ev.streams[0];
      console.log("remote stream", remoteStream);
      setRemoteStream(remoteStream);
    };

    peer.peer.addEventListener("track", handleTrackEvent);

    return () => {
      peer.peer.removeEventListener("track", handleTrackEvent);
    };
  }, [remoteStream]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", negotiationNeededHandler);
    socket.on("peer:negotiating", peerNegotiatingHandler);
    socket.on("peer:nego:final", peerNegoFinalHandler);
  }, []);

  useEffect(() => {
    if (myStreamRef.current && myStream) {
      myStreamRef.current.srcObject = myStream;
    }

    if (remoteStreamRef.current && remoteStream) {
      remoteStreamRef.current.srcObject = remoteStream;
      remoteStreamRef.current.muted = false; // ✅ enable audio
      remoteStreamRef.current.volume = 1; // ✅ set volume
      remoteStreamRef.current.play().catch((err) => {
        console.error("Error playing remote stream:", err);
      });
    }
  }, [myStream, remoteStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Video Call</h1>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 justify-center items-center">
        {myStream && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full lg:w-1/2">
            <h2 className="text-xl font-medium mb-2 text-center">My Stream</h2>
            <video
              ref={myStreamRef}
              autoPlay
              playsInline
              muted
              controls
              className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
        )}

        {remoteStream && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full lg:w-1/2">
            <h2 className="text-xl font-medium mb-2 text-center">
              Remote Stream
            </h2>
            <video
              ref={remoteStreamRef}
              autoPlay
              playsInline
              muted
              controls
              className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
