import React, { useEffect, useState, useCallback } from 'react';
import AceEditor from 'react-ace';
import '../App.css';

// Import Ace editor mode and theme files
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-jsx';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-cobalt';
import { addRoomDataAsync } from '../roomSlice/RoomSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { updateEditor } from '../roomSlice/RoomApi';

const socket = io('http://localhost:5000');


function CodeEditor({data}) {
    const { id1, id2} = useParams();
    const [text, setText] = useState('');
    const [mode, setMode] = useState('javascript');
    const [isLocalChange, setIsLocalChange] = useState(false);

    console.log(id1)

    const handleChange = (newValue) => {
        setIsLocalChange(true);
        setText(newValue);
    };

    useEffect(()=>{
        if(data){
            setText(data)
        }
        socket.emit('joinRoom', (id1))
    },[])
    
    useEffect(() => {
        const handleCodeEditor = (data) => {
            setIsLocalChange(false);
            console.log(data)
            setText(data);
        };

        socket.on('codeEditor', handleCodeEditor);

        return () => {
            socket.off('codeEditor', handleCodeEditor);
        };
    }, [socket]);

    const debounce = (func, delay) => {
        let timerId;
        return function(...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const debouncedEmit = useCallback(debounce((code) => {
        socket.emit('codeEditor', { id1, code });
    }, 300), [socket, id1]);


    const debouncedUpdate = useCallback(debounce(async(info)=>{
        await updateEditor(info)
    }, 500), [id1])
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLocalChange) {
            debouncedEmit(text);
            const id = id2
            debouncedUpdate({id, text})
        }
    }, [text, debouncedEmit, isLocalChange]);

    const handleModeChange = (e) => {
        setMode(e.target.value);
    };

    const handleSave = () => {
        dispatch(addRoomDataAsync({ id1, text }));
    };

    return (
        <div className='h-full w-full bg-white'>
            <div className='h-full w-full bg-slate-800 rounded-lg p-4 relative overflow-y-scroll scrollbar-none'>
                <div className='flex gap-3 justify-center pb-3'>
                    <button className='bg-green-400 text-white p-1 px-5 rounded-md z-30'>Copy</button>
                    <h2 className='text-white text-center text-xl relative z-30'>Code Editor</h2>
                    <button className='bg-orange-400 text-white p-1 px-5 rounded-md z-30' onClick={handleSave}>New Version</button>
                    <select className='bg-slate-400 text-white p-1 px-5 rounded-md z-30' name="SelectMode" id='modes' onChange={handleModeChange} value={mode}>
                        <option value="javascript">JAVASCRIPT</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </div>
                <div>
                    <AceEditor
                        mode={mode}
                        value={text}
                        theme='github_dark'
                        onChange={handleChange}
                        editorProps={{ $blockScrolling: true }}
                        placeholder="Write Your Code"
                        name="UNIQUE_ID_OF_DIV"
                        style={{
                            backgroundColor: '#1e293a',
                            width: '100%',
                            minHeight: '100%',
                            paddingRight: '15px',
                            marginRight: '-15px',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CodeEditor;
