
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useFiles } from "../../hooks/useFiles";
import { IUserFrontend } from "../../types/User";
import { IFileFrontend } from "../../types/File";
import { IImageFrontend } from "../../types/Image";
import {  LANGUAGES } from "../../types/other"
import { fileType } from "../../types/File";

//Defining the AppContextType
export interface AppContextType {
  user: IUserFrontend | null;
  userLoading: boolean;
  userError: string | null;
  filesLoading: boolean;
  filesError: string | null;
  files: IFileFrontend[] | [];
  currentFile: fileType | null;

  lightMode: boolean;
  setMode: (isLight: boolean) => void;
  lang: string;
  setLang: (lang: string) => void;

  currentFileId: string | null;
  editorReady: boolean;

  // User actions
  setUser: (user: IUserFrontend | null) => void;
  getUser: () => Promise<IUserFrontend | null>;
  getUsername: (userId: string) => Promise<string | null>
  getAllUsernames: () => Promise<{ _id: string, email: string }[] | null>
  getProfilePic: () => Promise<IImageFrontend | null>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<IImageFrontend | null>;
  login: (email: string, password: string) => Promise<IUserFrontend | null>;
  logout: () => Promise<void>;

  // File actions
  getCurrentFile: (currentFileId: string) => Promise<fileType | null>;
  getFiles: () => Promise<IFileFrontend[] | null>;
  getFile: (id: string) => Promise<fileType | null>;
  createFile: (fileData: Partial<IFileFrontend>) => Promise<IFileFrontend | null>;
  uploadFile: (file: File) => Promise<{ uploadedFile: IFileFrontend, category: string } | null>
  updateFile: (id: string, updates: Partial<IFileFrontend>) => Promise<IFileFrontend | null>;
  batchUpdateFiles: (filters: Partial<IFileFrontend>, updates: Partial<IFileFrontend>) => Promise<IFileFrontend | null>;
  restoreAllArchived: () => Promise<void>;
  deleteAllArchived: () => Promise<void>;
  lockFile: (id: string, lockedById: string) => Promise<IFileFrontend | null>;
  unlockFile: (id: string) => Promise<IFileFrontend | null>;
  deleteFile: (id: string) => Promise<boolean>;

  downloadPDF: (html: string) => Promise<void>
  setCurrentFileId: (id: string | null) => void;
  isUniqueFilename: (filename: string) => Promise<boolean>
}


export const AppContext = createContext<AppContextType | undefined>(undefined);

//this will be called by the individual components to access the global states
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};


//Allow any components to be passed as children
interface AppProviderProps {
  children: ReactNode;
}

//App.tsx is wrapped in this AppProvider so that all its child components can access its states and methods
export const AppProvider = ({ children }: AppProviderProps) => {
  const userHook = useUser();
  const filesHook = useFiles();
  const [currentFile, setCurrentFile] = useState< fileType| null>(null)
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [user, setUser] = useState<IUserFrontend | null>(null)
  const [editorReady, setEditorReady] = useState(false);
  const [lightMode, setMode] = useState(true)
  const [lang, setLang] = useState(LANGUAGES.en)


  //apply correct language and mode upon first render
  useEffect(() => {
    setMode(localStorage.getItem("lightMode") === "true")
    setLang(localStorage.getItem("i18nextLng")?.toUpperCase() ?? LANGUAGES.en)
  }, [])

  //modify the localStorage when mode changes
  useEffect(() => {
    localStorage.setItem("lightMode", String(lightMode))
  }, [lightMode])

  //modify the localStorage when language changes
  useEffect(() => {
    localStorage.setItem("lang", lang)
  }, [lang])



  //wait till user and currentFile is loaded first when page is rendered. Only reroute after that
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1️⃣ Load user
        let u: IUserFrontend | null = null;
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await userHook.getUser();
          setUser(userRes)
        }

        // 2️⃣ Load file
        const fileId = sessionStorage.getItem("fileId");
        if (fileId) {
          const f = await filesHook.getFile(fileId);
          if (f) {
            setCurrentFileId(fileId);

          }
        }
      } catch (err) {
        console.error("App initialization error:", err);
        setUser(null);
        setCurrentFile(null);
      } finally {
        // 3️⃣ Only now mark editor ready
        setEditorReady(true)
      }
    };

    initApp();
  }, []);

  //load the current file when currentFileId changes
  useEffect(() => {
    const load = async () => {
      if (currentFileId) {
          const f = await filesHook.getFile(currentFileId);
          if (f) {
            setCurrentFile(f);
            
          }
        }
    }
    load()
  }, [currentFileId])


  //fetch the current file's data from the database
  const getCurrentFile = async () => {
    const fileId = sessionStorage.getItem("fileId")
    if (!fileId) return null;
    const file = await filesHook.getFile(fileId);
    setCurrentFile(file);
    setCurrentFileId(fileId)
    return file;
  };

  const getUserIdFromToken = (token: string | null) => {
    if (!token) {
      console.log("token not found")
      return null
    }

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded._id || null;
    } catch {
      return null;
    }

  }


  const login = async (email: string, password: string) => {
    //Use hook to get the user, 
    const userFromHook = await userHook.login(email, password);
    if (userFromHook) {
      //Then store the logged in user's data in state
      setUser(userFromHook); // propagate state to provider
    }
    return userFromHook;
  };

  //Logout
  const logout = async () => {
    console.log("Logout is called")
    await userHook.logout();
    setUser(null); // propagate state
  };

  //Create file: backend call
  const createFile = async (fileData: Partial<IFileFrontend>) => {
    const createdFileFromHook = await filesHook.createFile(fileData)
    if (createdFileFromHook) {
      console.log("File successfully created")
      sessionStorage.setItem("fileId", createdFileFromHook._id);
      setCurrentFileId(createdFileFromHook._id)
      
    }
    return createdFileFromHook;
  }

  //Update Profile Picture
  const updateProfilePic = async (file: File) => {

    const res = await userHook.updateProfilePic(file)
    if (res) {
      console.log("Profile picture successfully updated")
      // Refresh user to get new profile_pic populated
      const updatedUser = await userHook.getUser();
      //Update user state
      if (updatedUser) setUser(updatedUser)
    }
    return res
  }

  //Helper method to check if filename is unique
  const isUniqueFilename = async (filename: string) => {
    const files: IFileFrontend[] | null = await filesHook.getFiles()
    const existingFilenames = files?.map((f) => f.filename)

    return !existingFilenames?.includes(filename)
  }

  //Call the backend API endpoint that handles PDF download
  const downloadPDF = async (html: string) => {
    const response = await filesHook.downloadPDF(html)
    if (!response) {
      console.log("Failed PDF download")
      return
    }
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

    const a = document.createElement("a");
    a.href = url;
    a.download = currentFile!.file.filename;
    a.click();
    window.URL.revokeObjectURL(url);

  }

  //All of these below are served as a prop to the provider
  const value = {
    // User state
    user: user,
    userLoading: userHook.loading,
    userError: userHook.error,

    //Editor-related
    currentFileId: currentFileId,
    editorReady: editorReady,

    lightMode: lightMode,
    setMode: setMode,
    lang: lang,
    setLang: setLang,

    // File state
    filesLoading: filesHook.loading,
    filesError: filesHook.error,
    files: filesHook.files,
    currentFile: currentFile,

    // User actions
    setUser: setUser,
    getUser: userHook.getUser,
    getUsername: userHook.getUsername,
    getAllUsernames: userHook.getAllUsernames,
    getProfilePic: userHook.getProfilePic,
    updateUser: userHook.updateUser,
    updateProfilePic: updateProfilePic,
    login: login,
    logout: logout,

    // File actions
    getCurrentFile: getCurrentFile,
    getFile: filesHook.getFile,
    getFiles: filesHook.getFiles,
    restoreAllArchived: filesHook.restoreAllArchived,
    deleteAllArchived: filesHook.deleteAllArchived,
    lockFile: filesHook.lockFile,
    unlockFile: filesHook.unlockFile,
    createFile: filesHook.createFile,
    uploadFile: filesHook.uploadFile,
    updateFile: filesHook.updateFile,
    batchUpdateFiles: filesHook.batchUpdateFiles,
    deleteFile: filesHook.deleteFile,

    downloadPDF: downloadPDF,
    setCurrentFileId: setCurrentFileId,
    isUniqueFilename: isUniqueFilename
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
