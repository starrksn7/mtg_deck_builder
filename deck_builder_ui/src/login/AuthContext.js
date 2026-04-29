import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  console.log("username when setting state = ", username)

  const login = (jwt, userId, username) => {
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username)
    console.log("username in the login function = ", username)
    setToken(jwt);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
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
