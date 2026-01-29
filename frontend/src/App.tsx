import './App.css'
import Header from "./components/main_components/Header"
import Body from "./components/main_components/Body"
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {IUser} from "../../server/src/models/User"
import { statusEnum } from './components/main_components/Home'
import { AppProvider } from './hooks/globalContext'



//tailwind css class hardcoded variables can come here



export interface IFileTest {
  _id: string,
   created_at: Date,
   created_by: string,
   last_edited_at: Date,
   file_type: string,
   status : string,
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

const testUserData: IUserTest = {
  username: "alice",
  email: "alice@example.com",
  password_hash: "vik12W///",
  profile_pic: "https://i.pravatar.cc/150?img=1",
  language: "en",
  mode: "light",
  files: [
    {
      _id : "63f1a3b2c4d5e6f789012345",
      created_at: new Date("2026-01-23T08:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-23T12:00:00Z"),
      file_type: "pdf",
      status : statusEnum.ACTIVE,
      filename: "report.pdf",
      content: "This is the annual report content...",
      word_count: 1200,
      canView: ["bob_google", "charlie@example.com"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: true,
      private: true,
      inUse: false,
    },
    {
      _id : "63f1a3b2c4d5e6f789012346",
      created_at: new Date("2026-01-22T09:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-22T09:15:00Z"),
      file_type: "png",
      status : statusEnum.ACTIVE,
      filename: "photo.png",
      content: "binary image data placeholder",
      canView: ["bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: true,
      usedBy: "bob_google",
    },
    {
      
      _id : "63f1a3b2c4d5e6f789012347",
      created_at: new Date("2026-01-21T10:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-21T11:00:00Z"),
      file_type: "txt",
      status : statusEnum.ACTIVE,
      filename: "notes.txt",
      content: "Meeting notes and ideas...",
      word_count: 300,
      canView: ["alice_google"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: false,
      private: true,
      inUse: false,
    },
    {
      
      _id : "63f1a3b2c4d5e6f789012348",
      created_at: new Date("2026-01-20T08:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-20T08:30:00Z"),
      file_type: "pptx",
      status : statusEnum.ACTIVE,
      filename: "presentation.pptx",
      content: "Slides for upcoming meeting...",
      canView: ["bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: false,
    },
    {
      
      _id : "63f1a3b2c4d5e6f789012349",
      created_at: new Date("2026-01-19T09:30:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-19T12:00:00Z"),
      file_type: "xlsx",
      status : statusEnum.ACTIVE,
      filename: "budget.xlsx",
      content: "Spreadsheet of the budget...",
      canView: ["alice_google", "bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: false,
      private: true,
      inUse: true,
      usedBy: "alice_google",
    },
    {
      
      _id : "63f1a3b2c4d5e6f78901234a",
      created_at: new Date("2026-01-18T07:15:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-18T10:00:00Z"),
      file_type: "svg",
      status : statusEnum.ARCHIVED,
      filename: "logo.svg",
      content: "<svg>...</svg>",
      canView: ["alice_google", "charlie@example.com"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: false,
    },
    {
      
  _id : "63f1a3b2c4d5e6f78901234b",
      created_at: new Date("2026-01-17T06:45:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-17T07:50:00Z"),
      file_type: "docx",
      status : statusEnum.ACTIVE,
      filename: "manual.docx",
      content: "User manual content...",
      word_count: 2500,
      canView: ["alice_google", "bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: true,
      private: true,
      inUse: false,
    },
    {
      
  _id : "63f1a3b2c4d5e6f78901234c",
      created_at: new Date("2026-01-16T05:30:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-16T10:25:00Z"),
      file_type: "vsdx",
      status : statusEnum.ACTIVE,
      filename: "diagram.vsdx",
      content: "Flowchart diagram content...",
      canView: ["bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: false,
      private: true,
      inUse: false,
    },
    {
      
  _id : "63f1a3b2c4d5e6f78901234d",
      created_at: new Date("2026-01-15T12:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-15T13:45:00Z"),
      file_type: "zip",
      status : statusEnum.ACTIVE,
      filename: "archive.zip",
      content: "Zipped project files...",
      canView: ["alice_google", "bob_google", "charlie@example.com"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: false,
    },
    {
      
  _id :"63f1a3b2c4d5e6f78901234e",
      created_at: new Date("2026-01-14T08:00:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-14T09:05:00Z"),
      file_type: "js",
      status : statusEnum.ACTIVE,
      filename: "script.js",
      content: "console.log('Hello World');",
      canView: ["alice_google"],
      canEdit: ["alice_google"],
      visibleToGuests: false,
      showsInHomeShared: false,
      private: true,
      inUse: true,
      usedBy: "alice_google",
    },
    {
      
  _id : "63f1a3b2c4d5e6f78901234f",
      created_at: new Date("2026-01-13T07:20:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-13T08:10:00Z"),
      file_type: "html",
      status : statusEnum.ACTIVE,
      filename: "index.html",
      content: "<!DOCTYPE html><html>...</html>",
      canView: ["alice_google", "bob_google"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: false,
    },
    {
      
  _id : "63f1a3b2c4d5e6f789012350",
      created_at: new Date("2026-01-12T06:15:00Z"),
      created_by: "alice_google",
      last_edited_at: new Date("2026-01-12T07:00:00Z"),
      file_type: "css",
      status : statusEnum.ACTIVE,
      filename: "styles.css",
      content: "body { background-color: #fff; }",
      canView: ["alice_google", "charlie@example.com"],
      canEdit: ["alice_google"],
      visibleToGuests: true,
      showsInHomeShared: true,
      private: false,
      inUse: false,
    },
  ],
};



function App() {

  const [jwt, setJwt] = useState<string | null>(null)
  //from server fetch: logged in user's personal data (IUser[])
  const [userData, setUserData] = useState<IUserTest>(testUserData)


  useEffect(() => {
        if(localStorage.getItem("token")) {
            setJwt(localStorage.getItem("token"))
        }
    }, [jwt])


  return (
    <>
      <AppProvider>
        <BrowserRouter>
        <Header userData={userData} setUserData={setUserData} jwt={jwt} setJwt={(c) => setJwt(c)}/>
        <Body userData={userData} setUserData={setUserData} jwt={jwt} setJwt={(c) => setJwt(c)}/>

      </BrowserRouter>
      </AppProvider>
    </>
  )
}

export default App
