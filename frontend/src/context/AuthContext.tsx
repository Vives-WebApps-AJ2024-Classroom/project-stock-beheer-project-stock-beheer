import React, { createContext, useState, useContext } from "react";
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
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccount(null);
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
