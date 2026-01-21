import React, { useState } from 'react'
import {Route, BrowserRouter, Routes} from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import Register from './Register'
import Home from './Home'
import Editor from './Editor'

type BodyProps = {
    jwt: string | null
}

const Body = ({jwt} : BodyProps) => {

  return (
    <div>
       {/* Body
      //route: login, register, home */}


      <Routes>
            <Route path="/" element={<Login />} ></Route>
            <Route path="/login" element={<Login />} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            {!jwt && <Route path="/home" element={<Login />} ></Route>}
            {jwt && <Route path="/home" element={<Home />} ></Route>}
            <Route path="/:user/:file" element={<Editor />} ></Route>
            <Route path="*" element={<div>Not found!</div>} />

        </Routes>
    </div>
  )
}

export default Body
