import React, { createContext, useContext, useState, useEffect } from "react";
import { clearCurrentUser, setCurrentUser } from "../services/adminApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
    } else {
      localStorage.removeItem("user");
      clearCurrentUser();
    }
  }, [user]);


  useEffect(() => {
    const loadUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")) || null);
    };

    // Initial load
    loadUser();

    // Listen to localStorage changes (works across tabs too)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {" "}
      {children}{" "}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
