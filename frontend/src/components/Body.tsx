import React, { useState } from 'react'
import {Route, BrowserRouter, Routes} from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import { Navigate } from 'react-router-dom'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'
import {IFile} from "../../../server/src/models/File"
import {IUser} from "../../../server/src/models/User"
import {IUserTest, IFileTest} from "../App"


type BodyProps = {
    userData: IUserTest,
    setUserData: (modifiedUser : IUserTest) => void,
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

const Body = ({userData, setUserData, jwt, setJwt} : BodyProps) => {

  return (
    <div>
       {/* Body
      //route: login, register, home */}


      <Routes key={jwt}>
            <Route path="/" element={<Login jwt={jwt} setJwt={(c) => setJwt(c)}/>} ></Route>
            <Route path="/login" element={<Login jwt={jwt} setJwt={(c) => setJwt(c)}/>} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/home" element={ <Home userData={userData} setUserData={setUserData}/>} ></Route>
            <Route path="/:user/:file" element={<Editor jwt={jwt}/>} ></Route>
            <Route path="*" element={<div>Not found!</div>} />

        </Routes>
    </div>
  )
}

export default Body
