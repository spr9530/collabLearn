import React, { useEffect, useState, useCallback } from 'react'
import AceEditor from 'react-ace';
import '../App.css'

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
import { addRoomDataAsync, setRoomCodeEditor } from '../roomSlice/RoomSlice';
import { useDispatch } from 'react-redux';




function CodeEditor({ socket }) {
    const [text, setText] = useState('');
    const [mode, setMode] = useState('javascript')
    const handleChange = (newValue) => {
        setText(newValue);
    };

    useEffect(() => {
        socket.on('codeEditor', (data) => {
            setText(data);
        })
    }, [])

    function debounce(func, delay) {
        let timerId;
        return function(...args) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    const debouncedEmit = useCallback(debounce((text) => {
        socket.emit('codeEditor', text);
    }, 300), [socket]);

    const dispatch = useDispatch()
    useEffect(() => {
        debouncedEmit(text);
        dispatch(setRoomCodeEditor(text));
    }, [text]);

    const handleModeChange = (e) => {
        setMode(e.target.value)
    }

    const handleSave = () =>{
        dispatch(addRoomDataAsync(text))
    }

    return (
        <div className='h-full w-full bg-white'>
            <div className='h-full w-full bg-slate-800 rounded-lg p-4 relative overflow-y-scroll scrollbar-none' >
                <div className='flex gap-3 justify-center pb-3'>
                    <button className='bg-green-400 text-white p-1 px-5 rounded-md z-30' >Copy</button>
                    <h2 className='text-white text-center text-xl relative z-30'>Code Editor</h2>
                    <button className='bg-orange-400 text-white p-1 px-5 rounded-md z-30'  onClick={handleSave}>Save</button>
                    <select className='bg-slate-400 text-white p-1 px-5 rounded-md z-30' name="SelectMode" id='modes' >
                        <option value="javascript" defaultValue={mode === 'javascript'} onClick={handleModeChange}>JAVASCRIPT</option>
                        <option value="html" defaultValue={mode === 'html'} onClick={handleModeChange}>HTML</option>
                        <option value="html" defaultValue={mode === 'css'} onClick={handleModeChange}>CSS</option>
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
                            backgroundColor: '#1e293a', // Set background color to Slate-400
                            width: '100%',
                            minHeight: '100%',
                            paddingRight: '15px',
                            marginRight: '-15px',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CodeEditor