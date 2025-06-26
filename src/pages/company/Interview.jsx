import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const Interview = () => {
    const location = useLocation();
    const roomId = location.state?.roomCode;

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const iceQueueRef = useRef([]);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [messages, setMessages] = useState([]);


    const [msg, setMsg] = useState("");
    const [socketId, setSocketId] = useState("");
    const [image, setImage] = useState(null);

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
            alert('Please allow camera and microphone access.');
            console.error('Error accessing media devices:', error);
        }
    };

    const createPeerConnection = async () => {
        const peerConnection = new RTCPeerConnection(configuration);
        peerRef.current = peerConnection;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track =>
                peerConnection.addTrack(track, localStreamRef.current)
            );
        }

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
        const init = async () => {
            await startVideo();

            socketRef.current = io(import.meta.env.VITE_API_URL);

            socketRef.current.on('connect', () => {
                setSocketId(socketRef.current.id);
                socketRef.current.emit('join-room', roomId);
            });

            socketRef.current.on('you-are-caller', async () => {
                await createPeerConnection();
                const offer = await peerRef.current.createOffer();
                await peerRef.current.setLocalDescription(offer);
                socketRef.current.emit('offer', { roomId, offer });
            });

            socketRef.current.on('you-are-callee', async () => {
                if (!localStreamRef.current) await startVideo();
                await createPeerConnection();
            });

            socketRef.current.on('offer', async ({ offer }) => {
                if (!localStreamRef.current) await startVideo();
                await createPeerConnection();
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                await processIceCandidates();
                const answer = await peerRef.current.createAnswer();
                await peerRef.current.setLocalDescription(answer);
                socketRef.current.emit('answer', { roomId, answer });
            });

            socketRef.current.on('answer', async ({ answer }) => {
                if (peerRef.current?.signalingState === 'have-local-offer') {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    await processIceCandidates();
                }
            });

            socketRef.current.on('ice-candidate', async ({ candidate }) => {
                if (peerRef.current?.remoteDescription) {
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

            socketRef.current.on('received-message', (data) => {
                setMessages(prev => [...prev, data]);
            });

        };

        init();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!msg && !image) return;
        socketRef.current.emit("message", { msg, room: roomId, image, from: socketRef.current.id });
        setMsg("");
        setImage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-100 flex flex-col items-center p-4 relative">
            <h1 className="text-3xl font-bold text-purple-800 mb-6">WebRTC Video Chat</h1>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
                {/* Video Section */}
                <div className="grid grid-cols-1 gap-4 md:w-2/3">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                        <div className="px-4 py-2 bg-gray-100 text-sm text-center font-semibold text-gray-700">You</div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                        <div className="px-4 py-2 bg-gray-100 text-sm text-center font-semibold text-gray-700">Remote</div>
                    </div>
                </div>

                {/* Chat Panel (visible on large devices) */}
                <div className="hidden md:flex flex-col bg-white border rounded-lg shadow p-4 h-[32rem] w-full md:w-1/3">
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {messages.map((msg, index) => {
                            const isSelf = msg.from === socketId;
                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg shadow max-w-xs break-words ${isSelf ? 'bg-purple-500 text-white ml-auto' : 'bg-white text-gray-800 mr-auto'
                                        }`}
                                >
                                    {msg.msg && <p>{msg.msg}</p>}
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Sent"
                                            className="max-w-full mt-2 rounded-md border"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message"
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                        {/* Custom file input */}
                        <div>
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-4 py-2 cursor-pointer text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition"
                            >
                                📎 Attach Image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                        >
                            Send
                        </button>
                    </form>

                </div>
            </div>

            {/* Floating Button (Mobile) */}
            <button
                onClick={() => setShowMobileChat(true)}
                className="md:hidden fixed bottom-5 right-5 bg-purple-600 text-white rounded-full p-4 shadow-lg z-50"
            >
                💬
            </button>

            {/* Fullscreen Chat Overlay for Mobile */}
            {showMobileChat && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b bg-purple-100">
                        <h2 className="text-xl font-bold text-purple-700">Chat</h2>
                        <button
                            onClick={() => setShowMobileChat(false)}
                            className="text-purple-700 text-xl font-bold"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">


                        {messages.map((msg, index) => {
                            const isSelf = msg.from === socketId;
                            return (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg shadow max-w-xs break-words ${isSelf ? 'bg-purple-500 text-white ml-auto' : 'bg-white text-gray-800 mr-auto'
                                        }`}
                                >
                                    {msg.msg && <p>{msg.msg}</p>}
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Sent"
                                            className="max-w-full mt-2 rounded-md border"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2 border-t">
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message"
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                        {/* Custom styled file input */}
                        <div>
                            <label
                                htmlFor="imageUpload"
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition text-sm"
                            >
                                📎 Choose Image
                            </label>
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                        >
                            Send
                        </button>
                    </form>

                </div>
            )}
        </div>
    );

};

export default Interview;