import React from 'react'
import { IoCloseCircle } from "react-icons/io5";

function Temp() {
  return (
    <div className='h-[200px] w-7/12 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primaryBackground z-20 p-3 flex flex-col'>
      <div className='w-full p-2 flex justify-between'>
        <h2 className='text-white text-4xl font-bold'>Join Room</h2>
        <button> <IoCloseCircle className='text-white text-xl' /></button>
      </div>
      <div className='flex gap-3 h-full items-center p-2'>
        <input className='rounded-lg py-3 px-2 bg-secondaryBackground text-white w-9/12 outline-none' type="text" placeholder='Enter Room Code'/>
        <button className='rounded-lg py-3 px-2 bg-pink-600 text-white w-3/12'>Join</button>
      </div>
    </div>
  )
}

export default Temp