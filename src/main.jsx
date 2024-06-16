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

const socket = io('http://localhost:5000');

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage socket={socket}/>,
  },
  {
    path:"login",
    element: <Login/>
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
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <RouterProvider router={router} />
  </Provider>,
)
