import React from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const App: React.FC = () => {
  return (
    <div className="app">
      <Topbar />
      <Sidebar />
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <p>Select a project from the sidebar to begin.</p>
      </div>
    </div>
  );
};

export default App;
