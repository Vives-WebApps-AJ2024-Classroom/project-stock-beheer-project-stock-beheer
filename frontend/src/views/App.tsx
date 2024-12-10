import React, { useState } from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import ProjectTable from "../components/ProjectTable";
import UserTable from "../components/UserTable";

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Sidebar zichtbaar of niet
  const [currentView, setCurrentView] = useState<string>("projects"); // Default weergave

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar zichtbaarheid
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view); // Wijzig de huidige weergave
  };

  return (
    <div className="app">
      <Topbar
        onProjectsClick={toggleSidebar} // Sidebar toggle functie
        onViewChange={handleViewChange} // View change functie
      />
      {isSidebarVisible && <Sidebar onProjectSelect={handleProjectSelect} />}
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
