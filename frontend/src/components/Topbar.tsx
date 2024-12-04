import React from "react";
import "../Layout/Topbar.css";
import "./Profile";
import Profile from "./Profile";
import { AuthProvider } from "../context/AuthContext";

const Topbar: React.FC = () => {
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
        <button>Query</button>
        <button>Stores</button>
        <button>Projects</button>
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
