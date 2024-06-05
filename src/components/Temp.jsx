import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { getUserInfo } from '../user/userApi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');



function Temp() {
  const [userInfo, setUserInfo] = useState(null)
  const location = useLocation();
  const [allowed, setAllowed] = useState(false)
  const code= location.state || {}
  if(code){
    console.log(code)
  }

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await getUserInfo()
      setUserInfo(userInfo)
    }
    getUser()
  }, [])
  useEffect(() => {

    socket.emit('roomCreate', code);

    socket.on('userAllowed', (code) => {
       setAllowed(true)
    });
    
    return () => {
        socket.off('userAllowed');
        
    };

}, [socket]);

  if (!userInfo) {
    return (<>loada...</>)
  }

  const handleJoinUser = () => {
    socket.emit('permissionToJoin', {code, userInfo})
    console.log('temp', userInfo)
  }

  if(allowed){
    return (<>{ <Navigate to={`/room/${code}`} replace={true} /> }</>)
  }

  if (userInfo) {
    return (
      <div className='flex flex-col justify-center items-center'>
        <div>Ask permission</div>
        <button onClick={handleJoinUser}>join</button>
      </div>

    )
  }
}

export default Temp