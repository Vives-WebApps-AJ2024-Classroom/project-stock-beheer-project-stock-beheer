import React, { useState, useEffect } from "react";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authConfig";
import { AccountInfo } from "@azure/msal-browser";
import { useAuth } from "../context/AuthContext"; // Importeer useAuth

const pca = new PublicClientApplication(msalConfig);

function MicrosoftLoginButton() {
  const { login } = useAuth(); // Gebruik login van de context

  const loginWithMicrosoft = async () => {
    try {
      const response = await pca.loginPopup(loginRequest);
      const userAccount = pca.getAllAccounts()[0]; // Haal het account op
      login(userAccount); // Geef account door aan de context
    } catch (err: any) {
      console.error("Login fout:", err);
    }
  };

  return (
    <MsalProvider instance={pca}>
      <div>
        <button onClick={loginWithMicrosoft}>Login</button>
      </div>
    </MsalProvider>
  );
}

export default MicrosoftLoginButton;
