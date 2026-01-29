
import { createContext, useContext, ReactNode, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useFiles } from "../../hooks/useFiles";
import { IUserFrontend } from "../../types/User";
import { IFileFrontend } from "../../types/File";

export interface AppContextType {
  user: IUserFrontend | null;
  userLoading: boolean;
  userError: string | null;
  filesLoading: boolean;
  filesError: string | null;

  currentFileId: string;

  // User actions
  refreshUser: () => Promise<void>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // File actions
  getFile: (id: string) => Promise<IFileFrontend | null>;
  getFiles: () => Promise<IFileFrontend[] | null>;
  createFile: (fileData: Partial<IFileFrontend>) => Promise<IFileFrontend | null>;
  updateFile: (id: string, updates: Partial<IFileFrontend>) => Promise<IFileFrontend | null>;
  deleteFile: (id: string) => Promise<boolean>;

  setCurrentFileId: (id: string) => void;
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
  const [currentFileId, setCurrentFileId] = useState<string>("")

  const value = {
    // User state
    user: userHook.user,
    userLoading: userHook.loading,
    userError: userHook.error,

    //Editor-related
    currentFileId: currentFileId,

    // File state
    filesLoading: filesHook.loading,
    filesError: filesHook.error,

    // User actions
    refreshUser: userHook.refreshUser,
    updateUser: userHook.updateUser,
    updateProfilePic: userHook.updateProfilePic,
    logout: userHook.logout,

    // File actions
    getFiles: filesHook.getFiles,
    getFile: filesHook.getFile,
    lockFile: filesHook.lockFile,
    unlockFile: filesHook.unlockFile,
    createFile: filesHook.createFile,
    updateFile: filesHook.updateFile,
    deleteFile: filesHook.deleteFile,

    setCurrentFileId: setCurrentFileId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
