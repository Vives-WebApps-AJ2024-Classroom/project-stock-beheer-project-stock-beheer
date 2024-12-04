import React from "react";
import "../Layout/Topbar.css";
import "./Profile";
import Profile from "./Profile";
import { AuthProvider } from "../context/AuthContext";

const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="logo">LOGO</div>
      <div className="topbar-buttons">
        <button>Query</button>
        <button>Stores</button>
        <button>Projects</button>
        <button>Users</button>
        <button>Alerts</button>
      </div>
      <div className="profile-button">
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </div>
    </div>
  );
};

export default Topbar;
