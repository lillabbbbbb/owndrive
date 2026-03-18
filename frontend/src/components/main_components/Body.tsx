import { Route, Routes } from "react-router-dom"
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'
import { useTranslation } from 'react-i18next'
import { ProtectedRoute } from './ProtectedRoute'
import { useAppContext } from '../context/globalContext'
import { useTheme } from "../context/ThemeContext"
import { useMemo, useRef } from "react"


const Body = () => {

  //import variables and functions from hooks
  const { currentFile, user, editorReady } = useAppContext()

  //Token
  const jwt = localStorage.getItem("token")

  const renderCount = useRef(0);
  renderCount.current++;

  console.log("RENDERS:", renderCount.current);


  const editorAllowed = useMemo(() => {
    if (!editorReady) return false;

    if (!currentFile) {
      console.log("currentfile not found");
      return false;
    }

    if (!user) {
      const allowed = currentFile.file.visibleToGuests ?? false;
      console.log("user not found, whether file is visible for guest:", allowed);
      return allowed;
    }

    const userId = user._id;

    const allowed =
      currentFile.file.canView?.includes(userId) ||
      currentFile.file.canEdit?.includes(userId) ||
      currentFile.file.created_by === userId;

    console.log("user and file found, editorallowed =", allowed);

    return allowed;
  }, [editorReady, currentFile, user]);


  if (!editorReady) {
    return <div>Loading...</div>; // wait for user and file to load
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
