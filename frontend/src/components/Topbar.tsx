import React from "react";
import "../Layout/Topbar.css";
import "./Profile";
import Profile from "./Profile";
import { AuthProvider } from "../context/AuthContext";

interface TopbarProps {
  onProjectsClick: () => void; // De functie die wordt aangeroepen wanneer op de Projects knop wordt geklikt
}

const Topbar: React.FC<TopbarProps> = ({ onProjectsClick }) => {
  return (
    <div className="topbar">
      <div className="logo">
        <img
          src="https://www.vives.be/sites/default/files/uploads/huisstijl/Logo%20VIVES%20Hogeschool%20-%20Smile.png"
          alt="Logo"
          style={{ width: "100px", height: "auto" }}
        />
      </div>

      <div className="topbar-buttons">
        <button onClick={onProjectsClick}>Projects</button>{" "}
        {/* Koppel de functie aan de knop */}
        <button>Query</button>
        <button>Stores</button>
        <button>Users</button>
        <button>Alerts</button>
      </div>
      <div className="profile-button profile">
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </div>
    </div>
  );
};

export default Topbar;
