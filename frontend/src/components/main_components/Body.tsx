import React, { useState } from 'react'
import {Route, BrowserRouter, Routes} from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import { Navigate } from 'react-router-dom'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'
import {IFile} from "../../../../server/src/models/File"
import {IUser} from "../../../../server/src/models/User"
import {IUserTest, IFileTest} from "../../App"


const Body = () => {
  const jwt = localStorage.getItem("token")

  return (
    <div className='mt-20'>

      <Routes key={jwt}>
            <Route path="/" element={<Login />} ></Route>
            <Route path="/login" element={<Login />} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/home" element={ <Home  />} ></Route>
            <Route path="/:user/:file" element={<Editor />} ></Route>
            <Route path="*" element={<div>Not found!</div>} />

        </Routes>
    </div>
  )
}

export default Body
