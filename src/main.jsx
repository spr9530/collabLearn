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
import store from '../store.js'
import { Provider } from 'react-redux';

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
  <Provider store={store}>
     <RouterProvider router={router} />
  </Provider>,
)
