import { Route, Routes } from "react-router-dom"
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'
import { useTranslation } from 'react-i18next'
import { ProtectedRoute } from './ProtectedRoute'
import { useAppContext } from '../context/globalContext'
import {useTheme} from "../context/ThemeContext"


const Body = () => {
  const { t } = useTranslation()
  const {lightMode} = useTheme()
  const jwt = localStorage.getItem("token")

  const { currentFileId, getFile, currentFile, user, editorReady, userLoading, filesLoading } = useAppContext()

  console.log(user)
  console.log(currentFile)
  

  if (!editorReady) {
    return <div>Loading...</div>; // wait for user and file to load
  }
  let editorAllowed = false;

  if (editorReady) {
    if (!currentFile) {
      editorAllowed = false
      console.log("currentfile not found")
    }

    else if (!user) {
      editorAllowed = currentFile.file.visibleToGuests ?? false
      console.log("user not found, whether file is visible for guest: " + currentFile.file.visibleToGuests)
    }
    else {
      const userId = user._id;
      editorAllowed =
        currentFile.file.canView?.includes(userId) ||
        currentFile.file.canEdit?.includes(userId) ||
        currentFile.file.created_by === userId;
      console.log("user and file found, editorallowed = " + editorAllowed)
    }
  }

  return (
    <div className='bg-transparent'>

      <Routes key={jwt}>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/home"
          element={
            <ProtectedRoute condition={!!jwt}>
              <Home />
            </ProtectedRoute>
          }>
        </Route>

        <Route path="/:user/:file" element={
          <Editor />
        } >
        </Route>

          <Route path="*" element={<Login />} />

      </Routes>
    </div>
  )
}

export default Body
