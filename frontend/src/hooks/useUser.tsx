import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { IUserFrontend } from "../types/User";
import { IImageFrontend } from "../types/Image";
import { useAppContext } from "../components/context/globalContext";

type UseUserReturn = {
  loading: boolean;
  error: string | null;

  getUser: () => Promise<IUserFrontend | null>;
  getProfilePic: () => Promise<IImageFrontend | null>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<IImageFrontend | null>;
  login: (email: string, password: string) => Promise<IUserFrontend | null>;
  logout: () => Promise<void>;
};

export function useUser(): UseUserReturn {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const isTokenValid = (token: string | null) => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > now;
    } catch {
      return false;
    }
  }

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
  const getUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IUserFrontend>(`api/users/me`);
      return res.data
    } catch (err) {
      handleError(err);
      return null
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch latest user data from server
  const getProfilePic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<IImageFrontend>(`/api/images/`)
      return res.data
    } catch (err) {
      handleError(err);
      return null
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user fields (name, email, etc.)
  const updateUser = useCallback(async (changes: Partial<IUserFrontend>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch<IUserFrontend>("/api/users/:userId", changes);
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
  console.log("🚀 updateProfilePic called with file:", file?.name)
  setLoading(true);
  setError(null);
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (description) formData.append("description", description);

    console.log("📤 Sending PATCH request to /api/users/me")
    const res = await axios.patch<IImageFrontend>("/api/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Response received:", res.data)
    return res.data;
  } catch (err) {
    console.error("❌ Error in updateProfilePic:", err)
    handleError(err);
    return null;
  } finally {
    setLoading(false);
  }
}, [getUser]);

  // Logout user
  const logout = useCallback(async () => {
    localStorage.removeItem("token")
    console.log("User successfully logged out.")
    return
  }, []);

  useEffect(() => {

    if (!isTokenValid(token)) {
      logout()
    }

  }, [token])


  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ user: IUserFrontend, token: string }>("/api/auth/login", {
        email: email,
        password: password
      });
      console.log(response)
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log(response.data.user)
      return response.data.user
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getUser,
    updateUser,
    updateProfilePic,
    getProfilePic,
    login,
    logout
  };
}
