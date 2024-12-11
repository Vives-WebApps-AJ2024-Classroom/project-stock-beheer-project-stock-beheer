import React, { useState } from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import ProjectTable from "../components/ProjectTable";
import UserTable from "../components/UserTable";
import WinkelTable from "../components/WinkelTabel";
import { useUser } from "../context/UserContext";
import BestellingHandleiding from "../components/Handleiding"; // Importeer de handleiding component

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>("handleiding"); // Begin met de handleiding
  const { user } = useUser();

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleLogoClick = () => {
    setCurrentView("handleiding"); // Zet de view naar handleiding wanneer het logo wordt aangeklikt
  };

  return (
    <div className="app">
      <Topbar
        onViewChange={handleViewChange}
        onProjectsClick={toggleSidebar}
        onLogoClick={handleLogoClick} // Voeg deze prop toe
      />
      {isSidebarVisible && (
        <Sidebar
          onProjectSelect={handleProjectSelect}
          onViewChange={handleViewChange} // Doorgeven aan de Sidebar
        />
      )}
      <div className={`main-content ${isSidebarVisible ? "" : "full-width"}`}>
        {currentView === "handleiding" && <BestellingHandleiding />}
        {/* Toon de handleiding bij het starten of wanneer het logo is aangeklikt */}
        {currentView === "projects" && (
          <ProjectTable selectedProjectId={selectedProjectId} />
        )}
        {currentView === "users" && user && user.role === "admin" && (
          <UserTable />
        )}
        {currentView === "winkels" && user && user.role === "admin" && (
          <WinkelTable />
        )}
      </div>
    </div>
  );
};

export default App;
