import React, { useState, useEffect } from 'react'
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import { Navigate } from 'react-router-dom'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'
import { IFile } from "../../../../server/src/models/File"
import { IUser } from "../../../../server/src/models/User"
import { IUserTest, IFileTest } from "../../App"
import { useTranslation } from 'react-i18next'
import { ProtectedRoute } from './ProtectedRoute'
import { useAppContext } from '../context/globalContext'


const Body = () => {
  const { t } = useTranslation()
  const jwt = localStorage.getItem("token")

  const { currentFileId, getFile, currentFile, user } = useAppContext()

  const [editorAllowed, setEditorAllowed] = useState(false);

  useEffect(() => {
    if (!currentFile) {
      setEditorAllowed(false);
      return;
    }

    if (!user) {
      setEditorAllowed(currentFile.file.visibleToGuests ?? false);
      return;
    }

    const userId = user._id;
    setEditorAllowed(
      currentFile.file.canView?.includes(userId) ||
      currentFile.file.canEdit?.includes(userId) ||
      currentFile.file.created_by === userId
    );
  }, [currentFile, user]);

  return (
    <div className='mt-20'>

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
          <ProtectedRoute condition={editorAllowed}>
            {currentFile ? <Editor /> : <div>Loading editor...</div>}
          </ProtectedRoute>
        } >
        </Route>

        <Route path="*" element={<div>{t("home.not-found")!}</div>} />

      </Routes>
    </div>
  )
}

export default Body
