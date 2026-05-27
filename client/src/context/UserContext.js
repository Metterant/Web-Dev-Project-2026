import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout } from "../services/authClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user from API
  const refetchUser = async () => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    refetchUser();
  }, []);

  // Handle login—fetch fresh user data from API
  const handleLogin = async () => {
    await refetchUser();
  };

  // Handle logout—clear user from context
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUser(null);
      setError(null);
    }
    return success;
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refetch: refetchUser,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
