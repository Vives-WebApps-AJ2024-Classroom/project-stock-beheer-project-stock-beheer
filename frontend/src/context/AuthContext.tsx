import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { AccountInfo } from "@azure/msal-browser";

interface AuthContextType {
  isAuthenticated: boolean;
  account: AccountInfo | null; // Voeg account toe aan de context
  login: (account: AccountInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState<AccountInfo | null>(null);

  const login = (account: AccountInfo) => {
    setIsAuthenticated(true);
    setAccount(account);

    updateUser();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccount(null);
  };
  const updateUser = async () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const backendPort = process.env.REACT_APP_BACKEND_PORT;
    const users = await axios.get(`${backendUrl}:${backendPort}/api/users`);
    for (let user of users.data) {
      if (user.name !== account?.username) {
        await axios.put(`${backendUrl}:${backendPort}/users`, {
          name: account?.name,
          role: "student",
        });
        return;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthContext, AuthProvider, useAuth };
