import React, { useEffect, useState } from 'react'
import CodeEditor from './components/CodeEditor'
import TextEditor from './components/TextEditor'
import WhiteBoard from './components/WhiteBoard'
import { useDispatch, useSelector } from 'react-redux';
import {selectRoomTextEditor, selectRoomWhiteBoard } from './roomSlice/RoomSlice';

function RoomPage({ socket }) {


    const [currPage, setCurrPage] = useState('CodeEditor')

    const changePage = (e) => {
        setCurrPage(e.target.id)
    }

    const saveRoomData = () =>{
        console.log(text)
    }   
    
    return (
        <div className='h-screen w-screen bg-text-slate-900 p-3'>
            <div>
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
    )
}

export default RoomPage