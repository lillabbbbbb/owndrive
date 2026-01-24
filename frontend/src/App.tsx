import './App.css'
import Header from "./components/Header"
import Body from "./components/Body"
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'


function App() {

  const [jwt, setJwt] = useState<string | null>(null)
  //from server fetch: logged in user's personal data (User)
  const [userData, setUserData] = useState(null)
  //from server fetch: logged in user's files (File[])
  const [userFiles, setUserFiles] = useState(null)

  const [language, setLanguage] = useState(null)
  const [mode, setMode] = useState(null)


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
