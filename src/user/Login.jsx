import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import {getUser, userLogginAsync } from './userSlice';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { checkUser } from './userApi';



function Login() {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    dispatch(userLogginAsync(data));
  };

  


  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(getUser)
  const [redirect, setRedirect] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(()=>{
    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')){
      const check = async () => {
        const check = await checkUser(localStorage.getItem('token'))
        if(check.error){
          console.log(check.error)
          setLoggedIn(false)
        }
        setLoggedIn(true)
      }
      check()
    }
  },[user])

  if(loggedIn){
    return(<Navigate to='/creatRoom' replace={true}/>)
  }

  

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col justify-center items-center h-screen gap-3 '>
            <input
              type="text"
              id='userName'
              name='userName'
              {...register("userName")}
              placeholder='UserName' />
            <input
              type="password"
              id='password'
              name='password'
              {...register("password")}
              placeholder='Password' />

            <button type='submit'>
              login
            </button>
          </div>

        </form>
      </div>
    </>
  );
}

export default Login;
