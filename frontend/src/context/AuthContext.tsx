import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AccountInfo } from "@azure/msal-browser";

interface AuthContextType {
  isAuthenticated: boolean;
  account: AccountInfo | null;
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
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccount(null);
  };

  useEffect(() => {
    const updateUser = async () => {
      if (!account) return;

      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      console.log("getting users from backend", `${backendUrl}/users`);
      const users = await axios.get(`${backendUrl}/users`);
      console.log(account.name);

      const userExists = users.data.some(
        (user: any) => user.name === account.name
      );

      if (!userExists) {
        await axios.post(`${backendUrl}/users`, {
          name: account.name,
          role: "student",
        });
      }
    };

    if (account) {
      updateUser();
    }
  }, [account]); // Alleen afhankelijk van 'account'

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
