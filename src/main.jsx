import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RoomPage from './RoomPage.jsx';
import CreateRoom from './CreateRoom.jsx';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom socket={socket}/>,
  },
  {
    path: "/room/:id",
    element: <RoomPage socket={socket}/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
