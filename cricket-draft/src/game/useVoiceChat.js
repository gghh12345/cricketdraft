import { useEffect, useRef, useState } from 'react';
import { socket } from './useDraftEngine';

export function useVoiceChat(roomCode, isActive) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const audioRef = useRef(null); 

  useEffect(() => {
    if (!isActive || !roomCode) return;

    let isComponentMounted = true;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (!isComponentMounted) return;
        localStream.current = stream;

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.relay.metered.ca:80" },
            { urls: "turn:global.relay.metered.ca:80", username: "d22a5174dee1ed834a8de442", credential: "DMBqw7F1GGcKplMi" },
            { urls: "turn:global.relay.metered.ca:80?transport=tcp", username: "d22a5174dee1ed834a8de442", credential: "DMBqw7F1GGcKplMi" },
            { urls: "turn:global.relay.metered.ca:443", username: "d22a5174dee1ed834a8de442", credential: "DMBqw7F1GGcKplMi" },
            { urls: "turns:global.relay.metered.ca:443?transport=tcp", username: "d22a5174dee1ed834a8de442", credential: "DMBqw7F1GGcKplMi" },
          ]
        });
        peerConnection.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          if (audioRef.current) {
            audioRef.current.srcObject = event.streams[0];
            setIsConnected(true);
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc-ice-candidate', { roomCode, candidate: event.candidate });
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            setIsConnected(true);
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            setIsConnected(false);
          }
        };
      } catch (err) {
        console.error("Microphone access denied or error:", err);
        setHasError(true);
      }
    }

    init();

    const handleOffer = async ({ sdp }) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('webrtc-answer', { roomCode, sdp: answer });
    };

    const handleAnswer = async ({ sdp }) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    };

    const handleIceCandidate = async ({ candidate }) => {
      if (!peerConnection.current) return;
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    };

    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleIceCandidate);

    return () => {
      isComponentMounted = false;
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleIceCandidate);
    };
  }, [isActive, roomCode]);

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const startCall = async () => {
    if (!peerConnection.current) return;
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('webrtc-offer', { roomCode, sdp: offer });
    } catch (e) {
      console.error("Error creating offer", e);
    }
  };

  return { isMuted, toggleMute, audioRef, hasError, isConnected, startCall };
}
