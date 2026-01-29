import { useState, useCallback } from "react";
import axios from "axios";
import { IUserFrontend } from "../types/User";
import { IImageFrontend } from "../types/Image";

type UseUserReturn = {
  user: IUserFrontend | null;
  loading: boolean;
  error: string | null;

  refreshUser: () => Promise<void>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<IUserFrontend | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  //Automatically add the Bearer token to each request
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // or from context
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  //General error handler, manually called with each API request
  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Server error");
    } else {
      setError("Unexpected error");
    }
  };

  // Fetch latest user data from server
  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IUserFrontend>("/api/users/me");
      setUser(res.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user fields (name, email, etc.)
  const updateUser = useCallback(async (changes: Partial<IUserFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IUserFrontend>("/api/users/me", changes);
      setUser(res.data);
      return res.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile picture
  const updateProfilePic = useCallback(async (file: File, description?: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (description) formData.append("description", description);

      await axios.patch("/api/users/profile_pic/change", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh user to get new profile_pic populated
      await refreshUser();
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  // Logout user
  const logout = useCallback(async () => {
    setUser(null);
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/auth/logout");
      //?????
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refreshUser,
    updateUser,
    updateProfilePic,
    logout,
  };
}
