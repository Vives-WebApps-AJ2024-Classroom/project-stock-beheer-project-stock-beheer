import React from "react";
import { useAuth } from "../context/AuthContext"; // Importeer de useAuth hook7
import MicrosoftLoginButton from "./MicrosoftLoginButton";

const Profile: React.FC = () => {
  const { isAuthenticated, account } = useAuth(); // Haal isAuthenticated en account uit de context

  return (
    <div className="profile">
      {isAuthenticated && account ? (
        <div>Welkom, {account.name}!</div> // Weergave van de naam van het account
      ) : (
        <MicrosoftLoginButton />
      )}
    </div>
  );
};

export default Profile;
