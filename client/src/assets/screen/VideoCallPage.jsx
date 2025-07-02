import React, { useEffect, useRef, useState, useContext } from "react";
import peer from "../services/peer";
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

      for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
        console.log("Adding track:", track);
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const negotiationNeededHandler = async () => {
    if (!videoCallSender) {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", {
        receiverId: authUser._id,
        senderId: currentReceiver?.userId?._id,
        offer,
      });
    }
  };

  // Get local stream on mount
  useEffect(() => {
    getUserMediaStream();
  }, []);

  // Handle remote track event
  useEffect(() => {
    const handleIceCandidate = async (ev) => {
      if (ev && ev.candidate) {
        console.log("sending ice-candidate", ev);
        socket?.emit("handle-ice-candidate", {
          receiverId: currentReceiver?.userId._id,
          iceCandidate: ev?.candidate,
        });
      }
    };
    const handleAddIceCandidate = async ({ iceCandidate }) => {
      console.log("Adding IceCandidate", iceCandidate);
      if (iceCandidate) {
        peer.peer
          .addIceCandidate(new RTCIceCandidate(iceCandidate))
          .catch((err) => {
            console.error("Failed to add ICE candidate:", err);
          });
      }
    };
    socket.on("add-ice-candidate", handleAddIceCandidate);
    peer.peer.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peer.peer.iceConnectionState);
    };
    peer.peer.addEventListener("icecandidateerror", (e) => {
      console.error("ICE Candidate Error:", e);
    });

    peer.peer.addEventListener("negotiationneeded", negotiationNeededHandler);
    peer.peer.addEventListener("icecandidate", handleIceCandidate);
    return () => {
      socket.off("add-ice-candidate", handleAddIceCandidate);
      peer.peer.removeEventListener(
        "negotiationneeded",
        negotiationNeededHandler
      );
      peer.peer.removeEventListener("icecandidate", handleIceCandidate);
    };
  }, []);
  useEffect(() => {
    const handleTrackEvent = (ev) => {
      const inboundStream = ev.streams[0];
      console.log("Received remote stream:", inboundStream);
      console.log("Remote audio tracks:", inboundStream.getAudioTracks());
      setRemoteStream(inboundStream);
    };
    peer.peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.peer.removeEventListener("track", handleTrackEvent);
    };
  }, []);

  // Setup negotiation and signaling
  useEffect(() => {
    const peerNegotiatingHandler = async ({ receiverId, senderId, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { senderId, receiverId, ans });
    };

    const peerNegoFinalHandler = async ({ ans }) => {
      await peer.setRemoteDescription(ans);
    };

    socket.on("peer:negotiating", peerNegotiatingHandler);
    socket.on("peer:nego:final", peerNegoFinalHandler);

    return () => {
      socket.off("peer:negotiating", peerNegotiatingHandler);
      socket.off("peer:nego:final", peerNegoFinalHandler);
    };
  }, []);

  // Set my stream to video element
  useEffect(() => {
    if (myStreamRef.current && myStream) {
      myStreamRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Set remote stream to video element
  useEffect(() => {
    if (remoteStreamRef.current && remoteStream) {
      const videoEl = remoteStreamRef.current;
      videoEl.srcObject = remoteStream;
      videoEl.muted = false;
      videoEl.volume = 1;

      const handleLoaded = () => {
        videoEl
          .play()
          .then(() => console.log("Remote video playing"))
          .catch((err) => console.error("Error playing remote video:", err));
      };
      videoEl.onloadedmetadata = handleLoaded;

      return () => {
        videoEl.onloadedmetadata = null;
      };
    }
  }, [remoteStream]);

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
              playsInline
              volume={1}
              className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
