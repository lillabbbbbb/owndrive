import './App.css'
import Header from "./components/Header"
import Body from "./components/Body"
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'


function App() {

  const [jwt, setJwt] = useState<string | null>(null)

  useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])


  return (
    <>
      <BrowserRouter>
        <Header jwt={jwt} setJwt={(c) => setJwt(c)}/>
        <Body jwt={jwt} setJwt={(c) => setJwt(c)}/>

      </BrowserRouter>
    </>
  )
}

export default App
