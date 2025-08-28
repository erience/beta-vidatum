"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("resUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const login = (username) => {
    localStorage.setItem("resUsername", username);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("resUsername");
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
