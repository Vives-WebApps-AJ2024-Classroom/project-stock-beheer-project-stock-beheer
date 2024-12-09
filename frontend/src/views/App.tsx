import React, { useState } from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/TabelComponent";

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Standaard sidebar is verborgen

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle de zichtbaarheid van de sidebar
  };

  return (
    <div className="app">
      <Topbar onProjectsClick={toggleSidebar} />{" "}
      {/* Geef de toggle functie door naar de Topbar */}
      {isSidebarVisible && (
        <Sidebar onProjectSelect={handleProjectSelect} />
      )}{" "}
      {/* Render de sidebar op basis van de zichtbaarheid */}
      <div className={`main-content ${isSidebarVisible ? "" : "full-width"}`}>
        <Table selectedProjectId={selectedProjectId} />
      </div>
    </div>
  );
};

export default App;
