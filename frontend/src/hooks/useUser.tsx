import { useState, useCallback } from "react";
import axios from "axios";
import { IUserFrontend } from "../types/User";

type UseUserReturn = {
  user: IUserFrontend | null;
  loading: boolean;
  error: string | null;

  refreshUser: () => Promise<void>;
  updateUser: (changes: Partial<IUserFrontend>) => Promise<IUserFrontend | null>;
  updateProfilePic: (file: File, description?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

export function useUser(): UseUserReturn {

  const [user, setUser] = useState<IUserFrontend | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTokenValid = (token: string | null) =>  {
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
    localStorage.removeItem("token")

    console.log("User successfully logged out.")
    return
  },[]);

  const token = localStorage.getItem("token")
  if(!isTokenValid(token)){
    logout()
  }


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
      setUser(response.data.user)
      return response.data.token
    } catch (err) {
      handleError(err);
      return null;
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
    login,
    logout,
  };
}
