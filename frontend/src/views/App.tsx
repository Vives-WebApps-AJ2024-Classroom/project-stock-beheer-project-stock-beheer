import React, { useState } from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/TabelComponent";

const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="app">
      <Topbar />
      <Sidebar onProjectSelect={handleProjectSelect} />
      <div className="main-content">
        <Table selectedProjectId={selectedProjectId} />
      </div>
    </div>
  );
};

export default App;
