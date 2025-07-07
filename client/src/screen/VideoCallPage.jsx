import { useEffect, useRef, useState, useContext } from "react";
import peer from "../services/peer";
import { useSocketContext } from "@/context/SocketContextProvider";
import { useChatContext } from "@/context/ChatContextProvider";
import { AuthContext } from "@/context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VideoCallPage = () => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const navigate = useNavigate();

  const { socket } = useSocketContext();
  const { currentReceiver, videoCallSender } = useChatContext();
  const { authUser } = useContext(AuthContext);

  // Getting User Media Stream
  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      for (const track of stream.getTracks()) {
        peer.peer.addTrack(track, stream);
        // console.log("Adding track:", track);
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Negotiation Needed Handler
  const negotiationNeededHandler = async () => {
    if (!videoCallSender) {
      // console.log("negotiationneeded")
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

  // Handling Ice candidates and negotiationNeeded
  useEffect(() => {
    const handleIceCandidate = async (ev) => {
      // console.log("current Receiver in handleicecandidates",currentReceiver)
      if (ev && ev.candidate) {
        // console.log("sending ice-candidate", ev);
        socket?.emit("handle-ice-candidate", {
          receiverId: currentReceiver?.userId._id,
          iceCandidate: ev?.candidate,
        });
      }
    };
    const handleAddIceCandidate = async ({ iceCandidate }) => {
      // console.log("Adding IceCandidate", iceCandidate);
      if (iceCandidate) {
        peer.peer
          .addIceCandidate(new RTCIceCandidate(iceCandidate))
          .catch((err) => {
            console.error("Failed to add ICE candidate:", err);
          });
      }
    };
    socket?.on("add-ice-candidate", handleAddIceCandidate);
    // peer.peer.oniceconnectionstatechange = () => {
    //   console.log("ICE connection state:", peer.peer.iceConnectionState);
    // };
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
  }, [socket, currentReceiver, peer]);

  // Handle remote track event
  useEffect(() => {
    const handleTrackEvent = (ev) => {
      const inboundStream = ev.streams[0];
      // console.log("Received remote stream:", inboundStream);
      // console.log("Remote audio tracks:", inboundStream.getAudioTracks());
      setRemoteStream(inboundStream);
    };
    peer.peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer]);

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
  }, [socket, peer]);

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

  useEffect(() => {
    const handleRejection = () => {
      // 1. Stop local tracks
      if (myStream) {
        myStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      // 2. Clear the stream from video element
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = null;
      }

      toast.error("Call Declined");
      navigate("/");
    };

    socket.on("receiver-rejected-call", handleRejection);

    return () => {
      socket.off("receiver-rejected-call", handleRejection);
    };
  }, [socket, myStream]);

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
              muted
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
