import React from "react";
import "../Layout/App.css";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Table from "../components/TabelComponent";

const App: React.FC = () => {
  return (
    <div className="app">
      <Topbar />
      <Sidebar />
      <div className="main-content">
        <Table />
      </div>
    </div>
  );
};

export default App;
