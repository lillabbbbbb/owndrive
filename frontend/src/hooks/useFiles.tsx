import { useState, useCallback } from "react";
import axios from "axios";
import { IFileFrontend } from "../types/File";

export function useFiles() {
  const [files, setFiles] = useState<IFileFrontend[] | []>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  //Automatically add the Bearer token to each request
  axios.interceptors.request.use((config) => {
  console.log('🔄 Interceptor triggered for:', config.url);
  console.log('📦 Headers before:', config.headers);
  
  const token = localStorage.getItem("token");
  console.log('🔑 Token from localStorage:', token ? `[${token.substring(0, 20)}...]` : 'NULL');
  
  if (token && token.trim() && token !== "null" && token !== "undefined") {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token.trim()}`;
    console.log('✅ Header added:', config.headers.Authorization?.substring(0, 50) + '...');
  } else {
    console.log('❌ No valid token found');
  }
  
  console.log('📦 Headers after:', config.headers);
  return config;
});
  //General error handler, manually called with each API request
  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) setError(err.response?.data?.message || "Server error");
    else setError("Unexpected error");
  };

  const getFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IFileFrontend[]>("/api/files/");
      const data = res.data
      setFiles(data)
      console.log("Files:")
      console.log(data)
      return data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IFileFrontend>(`/api/files/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFile = useCallback(async (fileData: Partial<IFileFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<IFileFrontend>("/api/files", fileData);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const updateFile = useCallback(async (id: string, updates: Partial<IFileFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IFileFrontend>(`/api/files/${id}`, updates);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const lockFile = useCallback(async (id: string, lockedById: string ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IFileFrontend>(`/api/files/${id}/lock`, lockedById);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockFile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IFileFrontend>(`/api/files/${id}/unlock`);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLockStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IFileFrontend>(`/api/files/${id}/lock_status`);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const deleteFile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/files/${id}`);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  //Some day: attach image to a file 

  return {
    loading,
    error,
    files,
    getFile,
    getFiles,
    createFile,
    updateFile,
    lockFile,
    unlockFile,
    getLockStatus,
    deleteFile,
  };
}
