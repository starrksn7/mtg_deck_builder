import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const login = (jwt, userId) => {
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("userId", userId);
    setToken(jwt);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
