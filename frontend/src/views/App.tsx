import React from "react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      {/* Topbar */}
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

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Projects</h3>
        <ul>
          <li>Water System</li>
          <li>Heating</li>
          <li>Security</li>
          <li>Tree detection</li>
          <li>Energy</li>
          <li>Monitoring</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <p>Select a project from the sidebar to begin.</p>
      </div>
    </div>
  );
};

export default App;
