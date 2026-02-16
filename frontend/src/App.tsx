import './App.css'
import { motion } from "framer-motion"
import Header from "./components/main_components/Header"
import Body from "./components/main_components/Body"
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './components/context/globalContext'
import { Toaster } from "sonner";
import { useEffect } from 'react'
import CustomCursor from './components/CustomCursor'
import axios from 'axios'
import { ThemeProvider } from "../src/components/context/ThemeContext"
import clsx from 'clsx'
import { THEME } from './theme'
import { useTheme } from "../src/components/context/ThemeContext"

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

  const { lightMode } = useTheme()

  console.log("lightMode value:", lightMode)
  useEffect(() => {
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem("token");
      if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);


  return (
    <>
      <div className="relative w-screen min-h-screen overflow-x-hidden">
        {/* Background */}
        <div
          className={clsx(
            "fixed inset-0 h-full w-full -z-20 transition-colors duration-300"
          )}
          style={{
            backgroundColor: lightMode ? 'white' : 'black',  // Super obvious test colors
            zIndex: -20
          }}
        />

        {/* Floating Circle */}
        <motion.div
          className="fixed w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{
            backgroundColor: lightMode ? 'rgba(254, 215, 170, 0.8)' : 'rgba(253, 186, 116, 0.8)',  // More opaque
            zIndex: -10
          }}
          animate={{
            x: [0, 150, -100, 0],
            y: [0, 80, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
        />




        <div className="relative z-0" style={{ cursor: "none" }}>
          <BrowserRouter>
            <Header />
            <div className="pt-20"> {/* Add padding-top here - adjust value based on your header height */}
              <Body /> {/* Body content grows naturally, background follows */}
            </div>
          </BrowserRouter>

          <Toaster />
        </div>

      </div >

      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
            ::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    * {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
        `}
      </style>
    </>
  )
}

export default App
