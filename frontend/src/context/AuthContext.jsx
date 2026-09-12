import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("accessToken");
    return savedUser ? { username: savedUser, token } : null;
  });
  const [loading, setLoading] = useState(true);

  // Farmer preferences (language, farm details, location)
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("krishi_preferences");
    return saved
      ? JSON.parse(saved)
      : {
          language: "hi", // 'hi', 'en', 'hinglish'
          farmLocation: "Jaipur, Rajasthan",
          landSize: "3",
          landUnit: "Acres",
          primaryCrop: "Wheat",
          soundEnabled: true,
        };
  });

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem("krishi_preferences", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const username = localStorage.getItem("loggedInUser");
      if (token && username) {
        try {
          // Verify with backend
          await authApi.getMe();
          setUser({ username, token });
        } catch (err) {
          console.warn("Token expired or invalid:", err);
          // Keep local session if network offline, or reset if 401
          if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    if (data && data.access_token) {
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("loggedInUser", username);
      setUser({ username, token: data.access_token });
      return data;
    }
    throw new Error("No token returned from server");
  };

  const register = async (username, password) => {
    const data = await authApi.register(username, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        preferences,
        updatePreferences,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
