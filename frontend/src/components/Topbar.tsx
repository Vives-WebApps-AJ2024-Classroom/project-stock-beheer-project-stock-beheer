import React from "react";
import "../Layout/Topbar.css";

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
        <button>Profile</button>
      </div>
    </div>
  );
};

export default Topbar;
