import React, { useEffect, useState } from 'react'
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { MdOutlineTextFields } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { FaPencilRuler } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { Navigate, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUserInfo, updateUserApi } from '../user/userApi';
import { createRoomFile, getRoomFiles, getRoomInfo, updateRoomUsers } from '../roomSlice/RoomApi';
import { useFieldArray, useForm } from "react-hook-form";
import Navbar from '../components/Navbar';
import CreateTask from '../components/CreateTask';
import { getAllTask, getUsersTask } from '../task/TaskApi';
import TaskInfo from '../components/TaskInfo';


function RoomPage({ socket }) {


    const [loading, setLoading] = useState(true)
    let { id1, id2 } = useParams();
    const navigate = useNavigate();
    const [allowed, setAllowed] = useState(false);
    const [userInfo, setUserInfo] = useState(null)
    const [roomInfo, setRoomInfo] = useState()
    const [taskInfo, setTaskInfo] = useState([])
    const [taskUpdated, setTaskUpdated] = useState(false);
    const [askPermission, setAskPermission] = useState(false)
    const [askingUser, setAskingUser] = useState('null')
    const [createDivVisibility, setCreateDivVisibility] = useState('hidden')
    const [roomFiles, setRoomFiles] = useState([])
    const [taskDivVisibility, setTaskDivVisibility] = useState('hidden')



    //fetch UserInfo
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo.error) {
                    navigate('/', { replace: true, state: { from: `/room/${id}` } })
                }
                setUserInfo(userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    // fetch RoomInfo
    useEffect(() => {
        const fetchRoomInfo = async () => {
            try {
                const response = await getRoomInfo(id1);
                setRoomInfo(response.roomInfo)
                if (userInfo) {
                    const userExists = response.roomInfo.users.some((user) => user.userId._id === userInfo._id);
                    setAllowed(userExists);
                }
            } catch (error) {
                console.error("Error fetching room info:", error);
            } finally {
                setLoading(false);
            }
        };


        if (userInfo) {
            fetchRoomInfo();
        }

    }, [userInfo, id2]);

    //fetch RoomFiles
    useEffect(() => {
        const fetchRoomFiles = async () => {
            const roomId = roomInfo.roomCode;
            const response = await getRoomFiles(roomId)
            if (response.error) {
                setRoomFiles([])
            }
            else {
                setRoomFiles(response.files)
            }
        }

        if (roomInfo) {
            fetchRoomFiles()
        }
    }, [roomInfo])

    //fetch RoomTasks
    useEffect(() => {
        const fetchTask = async () => {
            const task = await getUsersTask({ id1, id2: userInfo._id })
            setTaskInfo(task)
        }
        if (userInfo || taskUpdated) {
            fetchTask()
            setTaskUpdated(false)
        }

    }, [userInfo, taskUpdated])


    useEffect(() => {
        socket.on('permissionToJoin', (user) => {
            setAskPermission(true);
            setAskingUser(user);
        });
        if (roomInfo) {
            socket.emit('roomCreate', roomInfo.roomCode);
        }
        return () => {
            socket.off('permissionToJoin');
            socket.off('roomCreated');
        };

    }, [roomInfo, socket]);

    const handlePermissionGrant = async (e) => {
        e.preventDefault();
        try {
            // Update room users
            let users = [...roomInfo.users, { userId: askingUser._id, role: 'co-Admin', _id: askingUser._id }];
            const updateRoom = await updateRoomUsers({ id2, users });

            if (updateRoom.response) {
                console.log('here')
                socket.emit('userAllowed', { code: roomInfo.roomCode, roomId: roomInfo._id });
                setAskPermission(false);
                setAskingUser('null');
            }

        } catch (error) {
            console.error('Error updating room or user:', error);
        }
    }

    const handleCreate = () => {
        setCreateDivVisibility('visible')
    }

    const handleOpenFile = (fileInfo) => {
        if (fileInfo.editorType === 'folder') {
            console.log('folder')
        }
        else {
            navigate(`/room/${roomInfo._id}/${fileInfo.roomId}/${fileInfo._id}`);
        }
    }

    if (loading) {
        return <>Loading...</>;
    }



    if (!allowed) {
        return <Navigate to='/askPermission' />;
    }
    return (
        <>
            <Navbar />
            <div>
                {askPermission &&
                    <div className='bg-slate-900 p-5 rounded-md absolute top-1/2 left-1/2 flex flex-col z-50'>
                        <div className='text-white text-xl'>{askingUser.userName} is asking permission to join</div>
                        <button className='bg-white p-2 text-slate-900' onClick={(e) => (handlePermissionGrant(e))}>Grant</button>
                    </div>
                }
                <CreateTask visibility={taskDivVisibility} setVisibility={setTaskDivVisibility} roomInfo={roomInfo} />
                <CreateDiv visibility={createDivVisibility} setVisibility={setCreateDivVisibility} user={userInfo} setUser={setUserInfo} />
                <div className='bg-primaryBackground w-full flex gap-2 justify-center '>
                    <div className='w-9/12 shadow-primaryBoxShadow m-2 p-4 rounded-md h-screen overflow-scroll scrollbar-none'>
                        <div className='bg-secondaryBackground p-4 rounded-md m-2'>
                            <div className='flex w-full justify-between'>
                                <h2 className='text-white text-3xl font-bold'>Files</h2>
                                <div className='flex gap-2'>
                                    <button className='bg-purple-600 text-white p-1 px-3 rounded-lg flex items-center gap-1' onClick={handleCreate} >  Create <FaFileCirclePlus /> </button>
                                    <select className='bg-primaryBlue text-white p-1 px-3 rounded-lg flex items-center gap-1' > <option value="#"> View </option> </select>
                                    <select className='bg-primaryGreen text-white p-1 px-3 rounded-lg flex items-center gap-1'>
                                        <option value="#">Sort By</option>
                                        <option value="#">A-Z</option>
                                        <option value="#">Z-A</option>
                                        <option value="Date">Date</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-3 my-2'>
                                {roomFiles[0] ? roomFiles.map((file, index) => <div key={index} onClick={() => { handleOpenFile(file) }}><RoomFiles fileInfo={file} /></div>)
                                    : <div className='w-full h-full flex justify-center items-center text-gray-500 m-4'>No files</div>}
                            </div>
                        </div>
                        <div className='bg-secondaryBackground p-4 rounded-md m-2'>
                            <div className='flex w-full justify-between'>
                                <h2 className='text-white text-3xl font-bold'>Tasks</h2>
                                <button
                                    className='bg-primaryBlue text-white p-1 px-3 rounded-lg flex items-center gap-1'
                                    type='button'
                                    onClick={() => { setTaskDivVisibility('visible') }}
                                >Create Task <FaPencilRuler /></button>
                            </div>
                            <div className='flex flex-wrap gap-3 my-2'>
                                {taskInfo && taskInfo.userTask ? taskInfo.userTask.map((task, index) =>
                                    <div key={index}>
                                        <TaskInfo taskInfo={task} taskUpdated={taskUpdated} setTaskUpdated={setTaskUpdated} />
                                    </div>
                                ) : <div>No Task</div>}
                            </div>
                        </div>
                    </div>
                    <div className="w-3/12 shadow-primaryBoxShadow h-screen relative top-0 right-0 m-2 p-4 rounded-md flex flex-col">
                        <h2 className='text-white text-2xl font-bold flex items-center h-fit w-full justify-between'>Notification <span className='text-yellow-600'><FaRegBell /></span> </h2>
                        <div className='py-2 h-full w-full overflow-scroll scrollbar-none flex flex-col gap-2'>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


function CreateDiv({ visibility, setVisibility, user, setUser }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { id2 } = useParams()

    return (
        <div className={`fixed w-[400px] h-fit top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 p-4 bg-black text-white z-50 rounded-md ${visibility}`}>
            <button className='w-full flex justify-end' onClick={() => setVisibility('hidden')}> <IoCloseCircle className='text-white text-xl' /></button>
            <div className='text-xl font-bold text-gray-300'>Create New</div>
            <form onSubmit={handleSubmit(async (data) => {
                //create file
                const create = await createRoomFile({ roomId: id2, name: data.inputField, type: data.selectField })
                //update user
                const user = await getUserInfo()
                setVisibility('hidden')
                setUser(user)
            })}>
                <div className='flex flex-col justify-evenly h-[200px]'>
                    <input className='bg-black text-white border-b-primaryGreen border-b-2 outline-none'
                        name='name'
                        {...register('inputField',
                            { required: 'This field is required' })}
                        type="text"
                        placeholder='Name' />
                    {errors.inputField && <p className='text-red-500 text-sm'>{errors.inputField.message}</p>}

                    <select className='bg-black text-white border-b-primaryGreen border-b-2 outline-none'
                        name="type"
                        {...register('selectField', {
                            validate: value => value != '#' || 'Please select a valid type'
                        })}
                        id="creatOption"
                        required>
                        <option value="#">Type</option>
                        <option value="code">Code Editor</option>
                        <option value="text">Text Editor</option>
                        <option value="folder">Folder</option>
                    </select>
                    {errors.selectField && <p className='text-red-500 text-sm'>{errors.selectField.message}</p>}
                </div>
                <div className='w-full flex justify-end'>
                    <button className={` p-2 rounded-md bg-purple-600`} type='submit'>Create</button>

                </div>
            </form>
        </div>
    )
}

function RoomFiles({ fileInfo }) {
    return (
        <div>
            <div className='bg-black rounded-md w-[90px] h-[90px] flex flex-col justify-center items-center p-3'>
                <span className='text-primaryBlue text-3xl font-bolder mt-3'>{fileInfo.editorType == 'code' ? <FaCode /> : fileInfo.editorType == 'text' ? <MdOutlineTextFields className='text-white' /> : <FaFolder className='text-yellow-500' />}</span>
                <div className='text-white mt-3'>{fileInfo.editorName}</div>
            </div>
        </div>
    )
}




export default RoomPage