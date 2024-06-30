import React, { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { getUserInfo } from '../user/userApi';
import { useParams } from 'react-router-dom';

function MeetingPage({socket}) {
    const myVideo = useRef(null);
    const userVideo = useRef(null);
    const [userInfo, setUserInfo] = useState(null);
    const [myId, setmyId] = useState(null)
    const {roomId} = useParams()
    const [meetUser, setMeetUsers] = useState([])
    
    const fetchUserInfo = useCallback(async () => {
        try {
            const userInfo = await getUserInfo();
            if (userInfo.error) {
                navigate('/', { replace: true, state: { from: `/room/${id}` } });
            }
            setUserInfo(userInfo);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }, []);
    useEffect(() => {
        fetchUserInfo();
        
    }, [fetchUserInfo]);

    useEffect(()=> {
        if(userInfo){
            setmyId(userInfo._id)
        }
    }, [userInfo])

    useEffect(()=>{
        socket.emit('joinedMeet', {roomId , userId:myId})
        socket.on('newJoinee', (userId)=>{
            setMeetUsers(...meetUser, userId)
            callPeer(userId)
        })
    },[socket, myId])


    const peer = useRef();

    useEffect(() => {
        const peerInstance = new Peer(myId, {
            host: 'collab-learn-backend-blond.vercel.app',
            secure: true,  // Use secure connection (https)
            port: 443,     // Default HTTPS port
            path: '/app/v1/room/meeting',  // Path configured on your backend for PeerJS
            debug: 3       // Set debug level to see PeerJS logs
        });

        peerInstance.on('open', (id) => {
            console.log('My Peer ID:', id);
        });

        peerInstance.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then((stream) => {
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    if (myVideo.current) {
                        myVideo.current.srcObject = remoteStream;
                    }
                });
            }).catch((error) => {
                console.error('Error answering call:', error);
            });
        });

        peer.current = peerInstance;
        return () => {
            peerInstance.destroy(); // Clean up PeerJS instance on unmount
        };
    }, [myId, socket]);

    // Example function to call another Peer
    const callPeer = (peerId) => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then((stream) => {
            const call = peer.current.call(peerId, stream);
            call.on('stream', (remoteStream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = remoteStream;
                }
            });
        }).catch((error) => {
            console.error('Error calling peer:', error);
        });
    };
    
    
    return (
        <div>
            <h1>Meeting Page</h1>
            <div>
                <h2>My Video</h2>

                <button onClick={callPeer}>call</button>
                <video ref={myVideo} autoPlay muted />
            </div>
            <div>
                <h2>User Video</h2>
                <video ref={userVideo} autoPlay />
            </div>
        </div>
    );
}

export default MeetingPage;
