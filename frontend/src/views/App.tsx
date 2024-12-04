import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "./App.css";

  const App: React.FC = () => {
    const [projects, setProjects] = useState<string[]>([]);

    useEffect(() => {
      axios.get("/api/projects")
        .then((response) => {
          setProjects(response.data as string[]);
        })
        .catch((error: any) => {
          console.error("There was an error fetching the projects!", error);
        });
    }, []);

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
            {projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
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
  