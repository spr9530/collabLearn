import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import '../App.css';

// Import Ace editor mode and theme files
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import { IoCloseCircle } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { addNewVersion, updateEditor } from '../roomSlice/RoomApi';

const socket = io('http://localhost:5000');


function CodeEditor({ data, version, versionHistory }) {
    const { id1, id2, id3 } = useParams();
    const [text, setText] = useState('');
    const [isLocalChange, setIsLocalChange] = useState(false);
    const [vHistory, setVHistory] = useState('hidden')
    const [oldVer, setOldVer] = useState('hidden')
    const [oldVerData, setOldVerData] = useState(null)



    const handleChange = (newValue) => {
        setIsLocalChange(true);
        setText(newValue);
    };

    useEffect(() => {
        if (data) {
            setText(data)
        }
        socket.emit('connectEditor', (id3))
        return () => {
            socket.disconnect();
        };

    }, [data, id3])

    useEffect(() => {
        const handleCodeEditor = ({roomId, editorId, code}) => {
            setIsLocalChange(false);
            if(roomId == id1 && editorId == id3){
                setText(code);
            }
        };

        socket.on('codeEditor', handleCodeEditor);

        return () => {
            socket.off('codeEditor', handleCodeEditor);
        };
    }, [socket]);

    const debounce = (func, delay) => {
        let timerId;
        return function (...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const debouncedEmit = useCallback(debounce((code) => {
        socket.emit('codeEditor', { roomId: id1, editorId:id3, code });
    }, 300), [socket, id3]);


    const debouncedUpdate = useCallback(debounce(async (info) => {
        await updateEditor(info)
    }, 500), [id1])


    useEffect(() => {
        if (isLocalChange) {
            debouncedEmit(text);
            debouncedUpdate({ id3, roomData: text })
        }
    }, [text, debouncedEmit, isLocalChange]);

    const handleSave = async () => {
        const response = await addNewVersion({ id: id3, version: version, data: text })
        version = response;
    };

    const showOldVersion = (data) => {
        setOldVer('visible');
        setOldVerData(data)
        setVHistory('hidden')
    }

    return (
        <>
            <HistoryCode visible={oldVer} setVisible={setOldVer} data={oldVerData} />
            <div className='h-full w-full bg-primaryBackground'>
                <div className='h-full w-full  rounded-lg p-4 relative overflow-y-scroll scrollbar-none'>
                    <div className='flex gap-3 justify-center pb-3'>
                        <button className='bg-green-400 text-white p-1 px-5 rounded-md z-30'>Copy</button>
                        <h2 className='text-white text-center text-xl relative z-30'>Code Editor</h2>
                        <button className='bg-orange-400 text-white p-1 px-5 rounded-md z-30' onClick={handleSave}>New Version</button>
                        <div className='w-4/12 bg-secondaryBackground relative text-white '>
                            <div className='flex justify-between items-center p-2' >
                                <div className='cursor-pointer' onClick={() => setVHistory('visible')}>
                                    Version History
                                </div>
                                <div>
                                    {vHistory === 'visible' ?
                                        <button onClick={() => setVHistory('hidden')}><IoCloseCircle /></button> :
                                        <button onClick={() => setVHistory('visible')} ><FaChevronDown /></button>}
                                </div>

                            </div>
                            <div className={`w-full flex flex-col absolute top-8 z-50 bg-secondaryBackground gap-2 p-2 ${vHistory} max-h-[70vh] overflow-scroll scrollbar-none`}>
                                {versionHistory.length > 0 && versionHistory.map((curr) => (
                                    <div className='w-full bg-primaryBackground rounded-md text-white p-3 cursor-pointer' onClick={() => showOldVersion(curr.data)}>
                                        <div>Version {curr.version} </div>
                                        <div> Date {curr.date} </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                    <div>
                        <AceEditor
                            mode='javascript'
                            value={text}
                            theme='monokai'
                            onChange={handleChange}
                            editorProps={{ $blockScrolling: true }}
                            placeholder="Write Your Code"
                            name="UNIQUE_ID_OF_DIV"
                            style={{
                                width: '100%',
                                color: 'white',
                                minHeight: '100%',
                                paddingRight: '15px',
                                marginRight: '-15px',
                            }}
                        />
                    </div>
                </div>
            </div>
        </>

    );
}

export default CodeEditor;

function HistoryCode({ visible, setVisible, data }) {

    return (
        <div className={`w-screen h-screen absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-50 ${visible}`}>
            <div className='w-[90vw] h-[90vh] bg-secondaryBackground p-6 overflow-scroll scrollbar-none rounded-md'>
                <button className='fixed text-white font-bold text-2xl z-50' onClick={() => setVisible('hidden')}><IoCloseCircle /></button>

                <div className='h-full w-full p-2 mt-6'>
                    <AceEditor
                        mode='javascript'
                        value={data ? data : null}
                        theme='monokai'
                        editorProps={{ $blockScrolling: true }}
                        placeholder="Write Your Code"
                        name="UNIQUE_ID_OF_DIV"
                        style={{
                            width: '100%',
                            color: 'white',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
