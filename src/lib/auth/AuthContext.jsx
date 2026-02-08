"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user"); // 👈 AQUI
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData)); // 👈 AQUI
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("user"); // 👈 AQUI
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
