import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './Interview.css';

const Interview = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [roomInput, setRoomInput] = useState('');
    const [roomId, setRoomId] = useState(new URLSearchParams(window.location.search).get('room'));
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
        if (peerRef.current && peerRef.current.remoteDescription) {
            for (const candidate of iceQueueRef.current) {
                try {
                    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('Error adding queued ICE candidate:', err);
                }
            }
            iceQueueRef.current = [];
        }
    };

    const joinRoom = () => {
        if (!roomInput) {
            alert('Please enter a room ID');
            return;
        }
        window.location.search = `?room=${roomInput}`;
    };

    useEffect(() => {
        const isProduction = window.location.hostname !== 'localhost';
        const socketUrl = isProduction
            ? window.location.origin.replace('frontend', 'backend')
            : 'http://localhost:5000';
        socketRef.current = io(socketUrl);

        if (roomId) {
            startVideo().then(() => {
                if (localStreamRef.current) {
                    socketRef.current.emit('join-room', roomId);
                }
            });
        }

        socketRef.current.on('user-connected', async () => {
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
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            await processIceCandidates();
        });

        socketRef.current.on('ice-candidate', async ({ candidate }) => {
            if (peerRef.current && peerRef.current.remoteDescription) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                iceQueueRef.current.push(candidate);
            }
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
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [roomId]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">WebRTC Video Chat</h1>

            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mb-8">
                <div className="flex gap-2">
                    <input
                        id="roomInput"
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        id="joinButton"
                        onClick={joinRoom}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md transition hover:bg-blue-700 active:scale-95"
                    >
                        Join
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {/* Local Video Card */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
                    {!localStreamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <div className="w-8 h-8 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
                        </div>
                    )}
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover rounded-t-lg"
                    ></video>
                    <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 flex justify-between items-center">
                        <span>You</span>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Connected"></div>
                    </div>
                </div>

                {/* Remote Video Card */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
                    {!remoteVideoRef.current?.srcObject && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                            <div className="w-8 h-8 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
                        </div>
                    )}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover rounded-t-lg"
                    ></video>
                    <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 flex justify-between items-center">
                        <span>Remote</span>
                        <div className="w-3 h-3 bg-red-400 rounded-full" title="Waiting..."></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
