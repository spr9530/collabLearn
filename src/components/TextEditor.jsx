import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

function TextEditor({placeholder, socket}) {

    const editor = useRef(null);
	const [content, setContent] = useState('');

    const saveContent = () => {
        console.log('Content saved:', content);
    };

    const clearContent = () => {
        setContent('');
    };


    return (
        <div className='h-full w-full bg-white'>
            <div className='h-full w-full bg-slate-800 rounded-lg p-4 relative overflow-y-scroll scrollbar-none' >
                <div className='flex gap-3 justify-center pb-3'>
                <button className='bg-red-400 text-white p-1 px-5 rounded-md z-30' onClick={clearContent}>Clear</button>
                    <h2 className='text-white text-center text-xl relative z-30'>Code Editor</h2>
                    <button className='bg-orange-400 text-white p-1 px-5 rounded-md z-30' onClick={saveContent}>Save</button>
                   
                </div>
                <div className='h-full overflow-scroll'>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => setContent(newContent)}
                        style={{
                            backgroundColor: '#1e293a', // Set background color to Slate-400
                            width: '100%',
                            minHeight: '100%',
                            paddingRight: '15px',
                            marginRight: '-15px',
                        }} // preferred to use only this option to update the content for performance reasons
                    />
                </div>
            </div>
        </div>
    )
}

export default TextEditor