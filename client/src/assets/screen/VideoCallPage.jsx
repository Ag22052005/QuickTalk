import React, { useEffect, useRef, useState, useContext } from "react";
import peer from "../services/peer";
import { SocketContext } from "../../context/SocketContextProvider";
import { ChatContext } from "../../context/ChatContextProvider";
import { authContext } from "../../context/AuthContext";

const VideoCallPage = () => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myStreamRef = useRef(null);
  const remoteCanvasRef = useRef(null);
  const remoteAudioRef = useRef(null); // for playing audio separately

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

  const peerNegotiatingHandler = async ({ receiverId, senderId, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { senderId, receiverId, ans });
  };

  const peerNegoFinalHandler = async ({ ans }) => {
    await peer.setRemoteDescription(ans);
  };

  useEffect(() => {
    getUserMediaStream();
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

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", negotiationNeededHandler);
    socket.on("peer:negotiating", peerNegotiatingHandler);
    socket.on("peer:nego:final", peerNegoFinalHandler);

    return () => {
      socket.off("peer:negotiating", peerNegotiatingHandler);
      socket.off("peer:nego:final", peerNegoFinalHandler);
      peer.peer.removeEventListener("negotiationneeded", negotiationNeededHandler);
    };
  }, []);

  useEffect(() => {
    if (myStreamRef.current && myStream) {
      myStreamRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // 🎥 Draw video frames to <canvas>
  useEffect(() => {
    if (!remoteStream || !remoteCanvasRef.current) return;

    const videoEl = document.createElement("video");
    videoEl.srcObject = remoteStream;
    videoEl.playsInline = true;
    videoEl.muted = true;
    videoEl.autoplay = true;

    const canvas = remoteCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawToCanvas = () => {
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawToCanvas);
    };

    videoEl.onloadedmetadata = () => {
      videoEl.play().then(() => {
        drawToCanvas();
      });
    };
  }, [remoteStream]);

  // 🔊 Play audio via hidden <video>
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;

      const audioEl = remoteAudioRef.current;
      audioEl.onloadedmetadata = () => {
        audioEl.volume = 1;
        audioEl.play().catch((err) =>
          console.error("Audio play error:", err)
        );
      };
    }
  }, [remoteStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Video Call</h1>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 justify-center items-center">
        {/* My Stream */}
        {myStream && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full lg:w-1/2">
            <h2 className="text-xl font-medium mb-2 text-center">My Stream</h2>
            <video
              ref={myStreamRef}
              autoPlay
              playsInline
              muted
              className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover"
            />
          </div>
        )}

        {/* Remote Stream on Canvas */}
        {remoteStream && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full lg:w-1/2">
            <h2 className="text-xl font-medium mb-2 text-center">Remote Stream</h2>
            <canvas
              ref={remoteCanvasRef}
              width={640}
              height={400}
              className="rounded-xl w-full object-cover"
            />
          </div>
        )}

        {/* Hidden audio player for remote audio */}
        <video ref={remoteAudioRef} hidden />
      </div>
    </div>
  );
};

export default VideoCallPage;
