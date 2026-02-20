import { useState, useCallback } from "react";
import axios from "axios";
import { IFileFrontend } from "../types/File";
import { statuses } from "../components/main_components/Home";
import {toast} from "sonner"
import {fileType} from "../../src/types/File"

export function useFiles() {
  const [files, setFiles] = useState<IFileFrontend[] | []>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  //Automatically add the Bearer token to each request
  axios.interceptors.request.use((config) => {
    //console.log('🔄 Interceptor triggered for:', config.url);
    //console.log('📦 Headers before:', config.headers);

    const token = localStorage.getItem("token");
    //console.log('🔑 Token from localStorage:', token ? `[${token.substring(0, 20)}...]` : 'NULL');

    if (token && token.trim() && token !== "null" && token !== "undefined") {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token.trim()}`;
      //console.log('✅ Header added:', config.headers.Authorization?.substring(0, 50) + '...');
    } else {
      //console.log('❌ No valid token found');
    }

    //console.log('📦 Headers after:', config.headers);
    return config;
  });
  //General error handler, manually called with each API request
  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) setError(err.response?.data?.message || "Server error");
    else setError("Unexpected error");
    toast.error(error)
  };

  //Get all files of a user
  const getFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IFileFrontend[]>("/api/files/");
      const data = res.data
      console.log("Fetched files IDs:", data.map(f => f._id));
      setFiles(data)
      console.log("Files:")
      //console.log(data)
      return data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //Get a specific file of a user based on file ID
  const getFile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Promise< fileType | null>>(`/api/files/${id}`);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //POST request to create a new file with given data
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

  //POST request to upload a file 
  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post<{ uploadedFile: IFileFrontend, category: string }>(
        "/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //Update all files of a user that match a specific filter criteria (e.g. status == "archived")
  const batchUpdateFiles = useCallback(async (filters: Partial<IFileFrontend>, updates: Partial<IFileFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IFileFrontend>(`/api/files/`, { filters, updates });
      console.log("Files successfully updated")
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //PUT request to update a file of a user based on fileId
  const updateFile = useCallback(async (id: string, updates: Partial<IFileFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IFileFrontend>(`/api/files/${id}`, updates);
      toast.success("File successfully updated")
      
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //Restore user's files, using previously defined hooks and constant string values
  const restoreAllArchived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const filters = { status: statuses.ARCHIVED.value };
      const updates = { status: statuses.ACTIVE.value }

      const res = await batchUpdateFiles(filters, updates)
      console.log("Archives successfully restored")
      return;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [])

  //Delete user's files, using previously defined hooks and constant string values
  const deleteAllArchived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = { status: statuses.ARCHIVED.value };

      const res = await axios.delete("api/files/", { data: filters })
      console.log("Archives successfully deleted")
      return;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [])

  //Lock a file, based on fileId
  const lockFile = useCallback(async (id: string, lockedById: string) => {
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

  //Unlock a file, based on fileId
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

  //Get the locked status of a file (= is it being used or not)
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

  //Delete a file baed on fileID
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

  //Download PDf using backend route
  const downloadPDF = useCallback(async (html: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/pdf",
        { html },
        { responseType: "blob" }
      );
      console.log(res)
      return res
    } catch (err) {
      console.error("PDF generation failed:", err);
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
    uploadFile,
    updateFile,
    batchUpdateFiles,
    restoreAllArchived,
    deleteAllArchived,
    lockFile,
    unlockFile,
    getLockStatus,
    deleteFile,
    downloadPDF,
  };
}
