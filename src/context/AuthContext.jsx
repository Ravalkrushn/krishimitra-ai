import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

// Demo credentials
const DEMO_USERS = [
  {
    username: "farmer",
    password: "krishimitra123",
    name: "Rameshbhai Patel",
    role: "farmer",
    location: "Jamnagar, Gujarat",
  },
  {
    username: "admin",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    location: "Ahmedabad, Gujarat",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (found) {
      setUser(found);
      toast.success(`Welcome back, ${found.name}!`);
      return true;
    } else {
      toast.error("Invalid username or password.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
