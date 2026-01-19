import React from 'react'
import {Route, BrowserRouter, Routes} from "react-router-dom"
import Login from './Login'
import Header from "./Header"
import Register from './Register'
import Home from './Home'

const Body = () => {
  return (
    <div>
       {/* Body
      //route: login, register, home */}


      <Routes>
            <Route path="/" element={<Login />} ></Route>
            <Route path="/login" element={<Login />} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/home" element={<Home />} ></Route>
             <Route path="*" element={<div>Not found!</div>} />

        </Routes>
    </div>
  )
}

export default Body
