import React from "react";
import "../Layout/Topbar.css";
import "./Profile";
import Profile from "./Profile";
import "../Layout/Login.css";
import { useUser } from "../context/UserContext";

interface TopbarProps {
  onViewChange: (view: string) => void; // Functie om de huidige weergave te veranderen
  onProjectsClick: () => void; // Functie om de sidebar te toggelen
}

const Topbar: React.FC<TopbarProps> = ({ onViewChange, onProjectsClick }) => {
  const { user } = useUser();
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
        <button
          onClick={() => {
            onProjectsClick();
            onViewChange("projects");
          }}
        >
          Projects
        </button>
        {user && user.role === "admin" && (
          <div>
            <button onClick={() => onViewChange("users")}>Users</button>
          </div>
        )}
      </div>
      <div className="profile-button profile">
        <Profile />
      </div>
    </div>
  );
};

export default Topbar;
