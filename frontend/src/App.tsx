import './App.css'
import Header from "./components/main_components/Header"
import Body from "./components/main_components/Body"
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './components/context/globalContext'
import { Toaster } from "sonner";
import { useEffect } from 'react'
import CustomCursor from './components/CustomCursor'
import axios from 'axios'

//tailwind css class hardcoded variables can come here

export interface IFileTest {
  _id: string,
  created_at: Date,
  created_by: string,
  last_edited_at: Date,
  file_type: string,
  status: string,
  filename: string,
  content: string,
  word_count?: number,
  canView: string[], //list of usernames that can view the file
  canEdit: string[], //list of usernames that can edit the file
  visibleToGuests: boolean,
  showsInHomeShared: boolean,
  private: boolean,
  inUse: boolean, //= is anyone viewing (with edit permission) /editing this document
  usedBy?: string //the user _id, if any, that is "using" the file
}
export interface IUserTest {
  username?: string, //only for Google users?
  //googleId?: string, //google ID
  email: string,
  password_hash?: string,
  profile_pic?: string, //!
  language: string,
  mode: string, //light or dark mode
  files: IFileTest[]
}

const cursorSrc = "/cursor.png"


function App() {

  useEffect(() => {
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}, []);


  return (
    <>
      <div style={{ cursor: "none" }}>
        <CustomCursor src={undefined} size={30} />
        <AppProvider>
          <BrowserRouter>
            <Header />
            <Body />

          </BrowserRouter>
        </AppProvider>

        <Toaster />
      </div>
    </>
  )
}

export default App
