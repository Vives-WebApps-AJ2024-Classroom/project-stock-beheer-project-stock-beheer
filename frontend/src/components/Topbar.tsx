import React from "react";
import "../Layout/Topbar.css";
import "./Profile";
import Profile from "./Profile";
import "../Layout/Login.css";
import { useUser } from "../context/UserContext";

interface TopbarProps {
  onViewChange: (view: string) => void; // Functie om de huidige weergave te veranderen
  onProjectsClick: () => void; // Functie om de sidebar te toggelen
  onLogoClick: () => void; // Functie voor het klikken op het logo
}

const Topbar: React.FC<TopbarProps> = ({
  onViewChange,
  onProjectsClick,
  onLogoClick,
}) => {
  const { user } = useUser();

  return (
    <div className="topbar">
      <div className="logo">
        <img
          src="https://www.vives.be/sites/default/files/uploads/huisstijl/Logo%20VIVES%20Hogeschool%20-%20Smile.png"
          alt="Logo"
          style={{ width: "100px", height: "auto" }}
          onClick={onLogoClick} // Voeg click-handler toe voor logo
        />
      </div>
      <div className="topbar-buttons">
        {user && (
          <>
            <button
              onClick={() => {
                onProjectsClick();
              }}
            >
              Projects
            </button>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <button onClick={() => onViewChange("winkels")}>Winkels</button>
            <button onClick={() => onViewChange("users")}>Users</button>
          </>
        )}
        <Profile />
      </div>
    </div>
  );
};

export default Topbar;
