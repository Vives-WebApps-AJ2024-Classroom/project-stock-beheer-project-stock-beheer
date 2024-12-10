import React, { useState } from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import ProjectTable from "../components/ProjectTable";
import UserTable from "../components/UserTable";

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("projects"); // Huidige weergave

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="app">
      <Topbar onViewChange={handleViewChange} onProjectsClick={toggleSidebar} />
      {isSidebarVisible && (
        <Sidebar
          onProjectSelect={handleProjectSelect}
          onViewChange={handleViewChange} // Doorgeven aan de Sidebar
        />
      )}
      <div className={`main-content ${isSidebarVisible ? "" : "full-width"}`}>
        {currentView === "projects" && (
          <ProjectTable selectedProjectId={selectedProjectId} />
        )}
        {currentView === "users" && <UserTable />}
      </div>
    </div>
  );
};

export default App;
