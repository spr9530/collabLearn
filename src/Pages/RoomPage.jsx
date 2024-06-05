import React, { useEffect, useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import TextEditor from '../components/TextEditor'
import WhiteBoard from '../components/WhiteBoard'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../user/userSlice';
import { Navigate } from 'react-router-dom';
import { getRoomDataAsync, selectRoomInfo, updateRoomUsersAsync } from '../roomSlice/RoomSlice';
import { useParams } from 'react-router-dom';
import { getUserInfo, updateUserApi } from '../user/userApi';
import { getRoomInfo, updateRoomUsers } from '../roomSlice/RoomApi';

function RoomPage({ socket }) {


    const [currPage, setCurrPage] = useState('CodeEditor')
    const [loading, setLoading] = useState(true)

    const changePage = (e) => {
        setCurrPage(e.target.id)
    }

    let { id } = useParams();

    const [allowed, setAllowed] = useState(false);
    const [userInfo, setUserInfo] = useState(null)
    const [askPermission, setAskPermission] = useState(false)
    const [askingUser, setAskingUser] = useState('null')
    const [roomInfo, setRoomInfo] = useState(null)


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setUserInfo(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchRoomInfo = async () => {
            try {
                const response = await getRoomInfo(id);
                setRoomInfo(response.roomInfo)
                if (userInfo) {
                    const userExists = response.roomInfo.users.some((user) => user.userId === userInfo._id);
                    setAllowed(userExists);
                }
            } catch (error) {
                console.error("Error fetching room info:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchRoomInfo();
        }
    }, [userInfo, id]);

    useEffect(() => {

    }, [])

    useEffect(() => {
        socket.on('permissionToJoin', (user) => {
            console.log(user)
            setAskPermission(true);
            setAskingUser(user);
        });
        if (roomInfo) {
            socket.emit('roomCreate', roomInfo.roomCode);
        }
        return () => {
            socket.off('permissionToJoin');
            socket.off('roomCreated');
        };

    }, [roomInfo, socket]);

    const handlePermissionGrant = async (e) => {
        e.preventDefault();
    
        try {
            // Update room users
            let users = [...roomInfo.users, { userId: askingUser._id, role: 'co-Admin', _id: askingUser._id }];
            const updateRoom = await updateRoomUsers({ id, users });
    
            // Update user rooms
            let rooms = [...userInfo.rooms, { _id: roomInfo._id }];
            const updateUser = await updateUserApi( rooms );
            if (updateRoom.response && updateUser.data) {
                socket.emit('userAllowed', { code: roomInfo.roomCode, user: askingUser._id });
                setAskPermission(false);
                setAskingUser('null');
            }
        } catch (error) {
            console.error('Error updating room or user:', error);
        }
    }
    

    if (loading) {
        return <>Loading...</>;
    }

    if (!userInfo) {
        return <Navigate to='/' replace={true} />;
    }

    if (!allowed) {
        return <Navigate to='/askPermission' replace={true} state={id} />;
    }
    return (
        <>
            <div className='h-screen w-screen bg-text-slate-900 p-3'>
                <div>
                    {askPermission &&
                        <div className='bg-slate-900 p-5 rounded-md absolute top-1/2 left-1/2 flex flex-col z-50'>
                            <div className='text-white text-xl'>{askingUser.userName} is asking permission to join</div>
                            <button className='bg-white p-2 text-slate-900' onClick={(e) => (handlePermissionGrant(e))}>Grant</button>
                        </div>
                    }
                    <div className="header flex justify-between">
                        <div className="left gap-3">
                            Room
                        </div>
                        <div className="right flex gap-3">
                            <button id='CodeEditor' onClick={(e) => changePage(e)}>CodeEditor</button>
                            <button id='TextEditor' onClick={(e) => changePage(e)}>TextEditor</button>
                            <button id='WhiteBoard' onClick={(e) => changePage(e)}>WhiteBoard</button>

                        </div>

                    </div>
                    <div className="pageSection h-screen w-screen">
                        <div className={`${currPage === 'CodeEditor' ? 'flex' : 'hidden'} h-full w-full bg-yellow-400 text-slate-900`} ><CodeEditor socket={socket} /></div>
                        <div className={`${currPage === 'TextEditor' ? 'flex' : 'hidden'} h-full w-full bg-yellow-400 text-slate-900`}><TextEditor socket={socket} /></div>
                        <div className={`${currPage === 'WhiteBoard' ? 'flex' : 'hidden'} h-full w-full bg-yellow-400 text-slate-900`} ><WhiteBoard socket={socket} /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RoomPage