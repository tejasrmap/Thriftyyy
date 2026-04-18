import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to set axial headers & localStorage
  const authenticateUser = (userData) => {
    localStorage.setItem("luxerentUser", JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role);
    // Bind token generically to all future Axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("luxerentUser");
      if (storedUser && storedUser !== "undefined") {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.token) {
          authenticateUser(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error);
      localStorage.removeItem("luxerentUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    authenticateUser(data);
  };

  const signUp = async (fullName, email, password) => {
    const { data } = await axios.post("/api/auth/register", { fullName, email, password });
    authenticateUser(data);
  };

  const signInWithGoogle = async () => {
    const { data } = await axios.post("/api/auth/google");
    authenticateUser(data);
  };

  const adminSignIn = async (email, password) => {
    // We send it to standard login, but if they aren't marked as admin, throw error
    const { data } = await axios.post("/api/auth/login", { email, password });
    if (data.role !== "admin") {
      throw new Error("Invalid Administrator Credentials");
    }
    authenticateUser(data);
  };

  const logOut = async () => {
    localStorage.removeItem("luxerentUser");
    setUser(null);
    setRole(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signInWithGoogle, adminSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
