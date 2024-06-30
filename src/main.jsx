import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RoomPage from './Pages/RoomPage.jsx';
import CreateRoom from './Pages/CreateRoom.jsx';
import io from 'socket.io-client';
import store from '../store.js'
import { Provider } from 'react-redux';
import Login from './user/Login.jsx';
import Temp from './components/Temp.jsx';
import PermissionPage from './Pages/PermissionPage.jsx';
import EditorPage from './Pages/EditorPage.jsx';
import HomePage from './Pages/HomePage.jsx';
import SignUp from './user/SignUp.jsx';
import MeetingPage from './Pages/MeetingPage.jsx';

const socket = io('https://collab-learn-backend-blond.vercel.app', {
    withCredentials: true,
    transports: ['websocket', 'polling'],  // Specify transports to use
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage socket={socket}/>,
  },
  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/signUp",
    element: <SignUp/>
  },
  {
    path: "/creatRoom",
    element: <CreateRoom socket={socket}/>,
  },
  {
    path: "/room/:id1/:id2",
    element: <RoomPage socket={socket}/>,
  },
  {
    path: "/askPermission",
    element:<PermissionPage/>
  },
  {
    path: "/room/:id1/:id2/:id3",
    element:<EditorPage/>
  },
  {
    path: "/room/:roomId/meeting/:roomCode",
    element:<MeetingPage socket={socket}/>
  },
  {
    path: "/room/temp",
    element:<Temp socket={socket}/>
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <RouterProvider router={router} />
  </Provider>,
)
