import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEditor } from '../roomSlice/RoomApi';
import CodeEditor from '../components/CodeEditor';
import { getUserInfo } from '../user/userApi';
import TextEditor from '../components/TextEditor';


function EditorPage() {

  const navigate = useNavigate()

  const { id1, id2,id3 } = useParams();

  const [editorInfo, setEditorInfo] = useState(null)


  useEffect(() => {
    const fetchEditor = async () => {
      const response = await getEditor(id3)
      setEditorInfo(response.response)
    }

    const token = localStorage.getItem('token')
    const getUser = async () =>{
      const user = await getUserInfo(token)
    }
    getUser()
    fetchEditor()
  }, [])

  if(!localStorage.getItem('token')){
    navigate('/login', { replace: true, state: { from: 'home' } })
  }

  if(!editorInfo){
    return <>Lodaing.....</>
  }

  if(editorInfo.type === 'code'){
    return <CodeEditor  data={editorInfo.roomData? editorInfo.roomData: null} versionHistory={editorInfo.history} version={editorInfo.version}/>
  }else if(editorInfo.type === 'text'){
    return <TextEditor data={editorInfo.roomData? editorInfo.roomData: null}/>
  }

  return (
    <div>Error</div>
  )
}

export default EditorPage