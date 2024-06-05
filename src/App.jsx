import { useState } from 'react'
import './App.css'
import WhiteBoardPage from './WhiteBoardPage'
import CodeEditorPage from './CodeEditorPage'
import TextEditorPage from './TextEditorPage'
import CreateRoom from './Pages/CreateRoom'
import RoomPage from './Pages/RoomPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <RoomPage/>
    </>
  )
}

export default App
