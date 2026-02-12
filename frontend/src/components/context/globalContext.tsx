
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useFiles } from "../../hooks/useFiles";
import { IUserFrontend } from "../../types/User";
import { IFileFrontend } from "../../types/File";
import { IImageFrontend } from "../../types/Image";

export interface AppContextType {
  user: IUserFrontend | null;
  userLoading: boolean;
  userError: string | null;
  filesLoading: boolean;
  filesError: string | null;
  files: IFileFrontend[] | [];
  currentFile: { file: IFileFrontend, permissions: string[], base64data: string } | null;

  currentFileId: string | null;
  editorReady: boolean;

  // User actions
  setUser: (user: IUserFrontend | null) => void;
  getUser: () => Promise<IUserFrontend | null>;
  getUsername: (userId : string) => Promise<string | null>
  getAllUsernames: () => Promise<{_id: string, email: string}[] | null>
  getProfilePic: () => Promise<IImageFrontend | null>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<IImageFrontend | null>;
  login: (email: string, password: string) => Promise<IUserFrontend | null>;
  logout: () => Promise<void>;

  // File actions
  getCurrentFile: (currentFileId: string) => Promise<{ file: IFileFrontend, permissions: string[], base64data: string } | null>;
  getFiles: () => Promise<IFileFrontend[] | null>;
  getFile: (id: string) => Promise<{ file: IFileFrontend, permissions: string[], base64data: string } | null>;
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

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};


//Allow any components to be passed as children
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const userHook = useUser();
  const filesHook = useFiles();
  const [currentFile, setCurrentFile] = useState<{ file: IFileFrontend, permissions: string[], base64data: string } | null>(null)
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [user, setUser] = useState<IUserFrontend | null>(null)
  const [editorReady, setEditorReady] = useState(false);


  //wait till user and currentFile is loaded first when page is rendered. Only reroute after that
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1️⃣ Load user
        let u: IUserFrontend | null = null;
        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await userHook.getUser();
          // validate backend response
          
            setUser(u)
        }

        // 2️⃣ Load file
        const fileId = sessionStorage.getItem("fileId");
        if (fileId) {
          const f = await filesHook.getFile(fileId);
          if (f) {
            setCurrentFile(f);
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
    const userFromHook = await userHook.login(email, password);
    if (userFromHook) {
      setUser(userFromHook); // propagate state to provider
    }
    return userFromHook;
  };

  const logout = async () => {
    console.log("Logout is called")
    await userHook.logout();
    setUser(null); // propagate state
  };

  const createFile = async (fileData: Partial<IFileFrontend>) => {
    const createdFileFromHook = await filesHook.createFile(fileData)
    if (createdFileFromHook) {
      console.log("File successfully created")
      sessionStorage.setItem("fileId", createdFileFromHook._id);
      setCurrentFileId(createdFileFromHook._id)

    }
  }

  const updateProfilePic = async (file: File) => {

    const res = await userHook.updateProfilePic(file)
    if (res) {
      console.log("Profile picture successfully updated")
      // Refresh user to get new profile_pic populated
      const updatedUser = await userHook.getUser();
      if (updatedUser) setUser(updatedUser)
    }
    return res
  }

  const isUniqueFilename = async (filename: string) => {
    const files: IFileFrontend[] | null = await filesHook.getFiles()
    const existingFilenames = files?.map((f) => f.filename)

    return !existingFilenames?.includes(filename)
  }

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

  const value = {
    // User state
    user: user,
    userLoading: userHook.loading,
    userError: userHook.error,

    //Editor-related
    currentFileId: currentFileId,
    editorReady: editorReady,

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
