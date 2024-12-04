import React, { useState, useEffect } from "react";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authConfig";
import { AccountInfo } from "@azure/msal-browser";
import { useIsAuthenticated } from "@azure/msal-react"; // importeer de hook

const pca = new PublicClientApplication(msalConfig);

function MicrosoftLoginButton() {
  // State om bij te houden of de gebruiker ingelogd is
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null); // State voor error
  const [account, setAccount] = useState<AccountInfo | null>(null); // Account state

  // Functie voor inloggen bij klikken op de knop
  const login = async () => {
    console.log("Login knoppen is aangeklikt...");

    try {
      console.log("Start loginPopup...");
      // Gebruik loginPopup om in te loggen
      const response = await pca.loginPopup(loginRequest);
      console.log("Inloggen succesvol:", response);
      setIsAuthenticated(true); // Zet inlogstatus bij succes
      const userAccount = pca.getAllAccounts()[0]; // Haal het account op
      setAccount(userAccount); // Zet het account in de state
    } catch (err: any) {
      console.error("Login fout:", err);
      setError("Er is een fout opgetreden tijdens het inloggen.");
    }
  };

  return (
    <MsalProvider instance={pca}>
      <div>
        <button onClick={login}>Inloggen met Microsoft</button>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      </div>
    </MsalProvider>
  );
}

export default MicrosoftLoginButton;
