import './App.css'
import Header from "./components/Header"
import Body from "./components/Body"
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'



//tailwind css class hardcoded variables can come here


export interface IUser {
  filename: string;
  file_type: string;
  creator: string;
  last_modified: string;
}

const usersData: IUser[] = [
  { filename: "report1", file_type: ".docx", creator: "Alice", last_modified: "2026-01-19 09:30" },
  { filename: "presentation1.pptx", file_type: "Presentation", creator: "Bob", last_modified: "2026-01-18 16:45" },
  { filename: "photo1.png", file_type: "Image", creator: "Charlie", last_modified: "2026-01-17 12:10" },
  { filename: "data1.csv", file_type: "Spreadsheet", creator: "Alice", last_modified: "2026-01-16 08:55" },
  { filename: "report2.docx", file_type: "Document", creator: "Bob", last_modified: "2026-01-15 14:20" },
  { filename: "presentation2.pptx", file_type: "Presentation", creator: "Charlie", last_modified: "2026-01-14 11:05" },
  { filename: "photo2.png", file_type: "Image", creator: "Alice", last_modified: "2026-01-13 18:40" },
  { filename: "data2.csv", file_type: "Spreadsheet", creator: "Bob", last_modified: "2026-01-12 09:15" },
  { filename: "report3.docx", file_type: "Document", creator: "Charlie", last_modified: "2026-01-11 17:30" },
  { filename: "presentation3.pptx", file_type: "Presentation", creator: "Alice", last_modified: "2026-01-10 13:50" },
  { filename: "photo3.png", file_type: "Image", creator: "Bob", last_modified: "2026-01-09 10:25" },
  { filename: "data3.csv", file_type: "Spreadsheet", creator: "Charlie", last_modified: "2026-01-08 15:05" },
  { filename: "report4.docx", file_type: "Document", creator: "Alice", last_modified: "2026-01-07 12:00" },
  { filename: "presentation4.pptx", file_type: "Presentation", creator: "Bob", last_modified: "2026-01-06 16:45" },
  { filename: "photo4.png", file_type: "Image", creator: "Charlie", last_modified: "2026-01-05 09:30" },
  { filename: "data4.csv", file_type: "Spreadsheet", creator: "Alice", last_modified: "2026-01-04 14:10" },
  { filename: "report5.docx", file_type: "Document", creator: "Bob", last_modified: "2026-01-03 11:20" },
  { filename: "presentation5.pptx", file_type: "Presentation", creator: "Charlie", last_modified: "2026-01-02 17:35" },
  { filename: "photo5.png", file_type: "Image", creator: "Alice", last_modified: "2026-01-01 08:50" },
  { filename: "data5.csv", file_type: "Spreadsheet", creator: "Bob", last_modified: "2025-12-31 19:15" },
];


function App() {

  const [jwt, setJwt] = useState<string | null>(null)
  //from server fetch: logged in user's personal data (User)
  const [userData, setUserData] = useState([])
  //from server fetch: logged in user's files (File[])
  const [userFiles, setUserFiles] = useState([]])

  const [language, setLanguage] = useState("en")
  const [mode, setMode] = useState("light")


  useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])


  return (
    <>
      <BrowserRouter>
        <Header jwt={jwt} setJwt={(c) => setJwt(c)}/>
        <Body userData={userData} jwt={jwt} setJwt={(c) => setJwt(c)}/>

      </BrowserRouter>
    </>
  )
}

export default App
