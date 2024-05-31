import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WhiteBoard from './components/WhiteBoard'
import WhiteBoardPage from './WhiteBoardPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <WhiteBoardPage/>
    </>
  )
}

export default App
