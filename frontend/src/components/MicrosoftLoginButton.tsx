import React, { useState, useEffect } from "react";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authConfig";
import { AccountInfo } from "@azure/msal-browser";
import { useAuth } from "../context/AuthContext"; // Importeer useAuth

const pca = new PublicClientApplication(msalConfig);

function MicrosoftLoginButton() {
  const isAuthenticated = useIsAuthenticated();
  const { login } = useAuth(); // Gebruik login van de context
  const [error, setError] = useState<string | null>(null);

  const loginWithMicrosoft = async () => {
    try {
      const response = await pca.loginPopup(loginRequest);
      const userAccount = pca.getAllAccounts()[0]; // Haal het account op
      login(userAccount); // Geef account door aan de context
    } catch (err: any) {
      console.error("Login fout:", err);
      setError("Er is een fout opgetreden tijdens het inloggen.");
    }
  };

  return (
    <MsalProvider instance={pca}>
      {!isAuthenticated ? (
        <div>
          <button onClick={loginWithMicrosoft}>Inloggen met Microsoft</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <div>
          <p>Je bent ingelogd!</p>
        </div>
      )}
    </MsalProvider>
  );
}

export default MicrosoftLoginButton;
