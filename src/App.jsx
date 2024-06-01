import { useState } from 'react'
import './App.css'
import WhiteBoardPage from './WhiteBoardPage'
import CodeEditorPage from './CodeEditorPage'
import TextEditorPage from './TextEditorPage'
import CreateRoom from './CreateRoom'
import RoomPage from './RoomPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <RoomPage/>
    </>
  )
}

export default App
