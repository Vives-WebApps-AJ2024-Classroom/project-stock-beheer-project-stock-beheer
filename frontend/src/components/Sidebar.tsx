import React from "react";
import "../Layout/Sidebar.css";

const Sidebar: React.FC = () => {
  return (
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
  );
};

export default Sidebar;
