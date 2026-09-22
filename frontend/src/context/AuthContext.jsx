import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, partnerAuthApi, profileApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole") || "farmer";
    return savedUser ? { username: savedUser, token, role } : null;
  });
  const [loading, setLoading] = useState(true);

  // Farmer preferences (language, farm details, location)
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("krishi_preferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Corrupted preferences — clear and fall back to defaults
        localStorage.removeItem("krishi_preferences");
      }
    }
    return {
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
      // Asynchronously sync with backend if authenticated
      if (localStorage.getItem("accessToken")) {
        profileApi.updateProfile({
          language: updated.language,
          farm_location: updated.farmLocation,
          land_size: updated.landSize,
          land_unit: updated.landUnit,
          primary_crop: updated.primaryCrop,
          sound_enabled: updated.soundEnabled,
        }).catch(() => { /* silent fallback to local */ });
      }
      return updated;
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const username = localStorage.getItem("loggedInUser");
      if (token && username) {
        try {
          // Verify with backend and obtain current role
          const me = await authApi.getMe();
          const role = me.role || "farmer";
          localStorage.setItem("userRole", role);
          setUser({ username, token, role });

          // Fetch server-authoritative farmer profile only for farmers
          if (role === "farmer") {
            try {
              const serverProfile = await profileApi.getProfile();
              if (serverProfile) {
                setPreferences((prev) => {
                  const synced = {
                    ...prev,
                    language: serverProfile.language || prev.language,
                    farmLocation: serverProfile.farmLocation || prev.farmLocation,
                    landSize: serverProfile.landSize || prev.landSize,
                    landUnit: serverProfile.landUnit || prev.landUnit,
                    primaryCrop: serverProfile.primaryCrop || prev.primaryCrop,
                    soundEnabled: serverProfile.soundEnabled !== undefined ? serverProfile.soundEnabled : prev.soundEnabled,
                  };
                  localStorage.setItem("krishi_preferences", JSON.stringify(synced));
                  return synced;
                });
              }
            } catch {
              // Profile fetch optional on offline/cold start
            }
          }
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
      const role = data.role || "farmer";
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("userRole", role);
      setUser({ username, token: data.access_token, role });
      return { ...data, role };
    }
    throw new Error("No token returned from server");
  };

  const loginPartner = async (identifier, password, requiredRole) => {
    const data = await partnerAuthApi.login(identifier, password, requiredRole);
    if (data && data.access_token) {
      const role = data.role || requiredRole;
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("loggedInUser", identifier);
      localStorage.setItem("userRole", role);
      setUser({ username: identifier, token: data.access_token, role });
      return { ...data, role };
    }
    throw new Error("No token returned from server");
  };

  const registerPartner = async (partnerData) => {
    return await partnerAuthApi.register(partnerData);
  };

  const loginWithToken = (username, token, role = "farmer") => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("userRole", role);
    setUser({ username, token, role });
  };

  const register = async (username, password, role = "farmer") => {
    const data = await authApi.register(username, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || "farmer",
        isShopOwner: user?.role === "shop_owner",
        isRider: user?.role === "rider",
        loading,
        preferences,
        updatePreferences,
        login,
        loginPartner,
        registerPartner,
        loginWithToken,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

