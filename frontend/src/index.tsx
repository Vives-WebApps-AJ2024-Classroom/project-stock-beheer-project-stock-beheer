import React from "react";
import ReactDOM from "react-dom/client";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./views/App";
import "./Layout/Colors.css";
import { UserProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <UserProvider>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </UserProvider>
);
