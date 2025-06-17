import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Interview.css';
import { useLocation } from 'react-router-dom';

const Interview = () => {
    const location = useLocation();
    const roomId = location.state?.roomCode; // ✅ Always present

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const iceQueueRef = useRef([]);

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            }
        ]
    };

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const createPeerConnection = async () => {
        const peerConnection = new RTCPeerConnection(configuration);
        peerRef.current = peerConnection;

        localStreamRef.current.getTracks().forEach(track =>
            peerConnection.addTrack(track, localStreamRef.current)
        );

        peerConnection.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', { roomId, candidate: event.candidate });
            }
        };
    };

    const processIceCandidates = async () => {
        if (peerRef.current?.remoteDescription) {
            for (const candidate of iceQueueRef.current) {
                try {
                    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('Error adding ICE candidate:', err);
                }
            }
            iceQueueRef.current = [];
        }
    };

    useEffect(() => {
        const socketUrl = 'http://localhost:5000';
        socketRef.current = io(socketUrl);

        startVideo().then(() => {
            if (localStreamRef.current) {
                socketRef.current.emit('join-room', roomId);
            }
        });

        socketRef.current.on('ready', async () => {
            await createPeerConnection();
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', { roomId, offer });
        });

        socketRef.current.on('offer', async ({ offer }) => {
            await createPeerConnection();
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            await processIceCandidates();
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socketRef.current.emit('answer', { roomId, answer });
        });

        socketRef.current.on('answer', async ({ answer }) => {
            if (peerRef.current?.signalingState === 'have-local-offer') {
                try {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    await processIceCandidates();
                } catch (err) {
                    console.error('Failed to set remote description (answer):', err);
                }
            } else {
                console.warn('Skipped setting remote answer: wrong signaling state', peerRef.current?.signalingState);
            }
        });

        socketRef.current.on('ice-candidate', async ({ candidate }) => {
            if (peerRef.current?.remoteDescription) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                iceQueueRef.current.push(candidate);
            }
        });

        socketRef.current.on('you-are-caller', async () => {
            await createPeerConnection();
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', { roomId, offer });
        });

        socketRef.current.on('you-are-callee', async () => {
            await createPeerConnection();
        });

        socketRef.current.on('user-disconnected', () => {
            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">WebRTC Video Chat</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                    <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700">You</div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                    <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700">Remote</div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
