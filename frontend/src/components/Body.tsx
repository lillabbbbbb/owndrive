import React, { useState } from 'react'
import {Route, BrowserRouter, Routes} from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import { Navigate } from 'react-router-dom'
import Register from './Register'
import Home from './Home'
import Editor from './Editor'

type BodyProps = {
    jwt: string | null,
    setJwt: (c: string | null) => void;
}

const Body = ({jwt, setJwt} : BodyProps) => {

  return (
    <div>
       {/* Body
      //route: login, register, home */}


      <Routes key={jwt}>
            <Route path="/" element={<Login jwt={jwt} setJwt={(c) => setJwt(c)}/>} ></Route>
            <Route path="/login" element={<Login jwt={jwt} setJwt={(c) => setJwt(c)}/>} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/home" element={ <Home />} ></Route>
            <Route path="/:user/:file" element={<Editor />} ></Route>
            <Route path="*" element={<div>Not found!</div>} />

        </Routes>
    </div>
  )
}

export default Body
