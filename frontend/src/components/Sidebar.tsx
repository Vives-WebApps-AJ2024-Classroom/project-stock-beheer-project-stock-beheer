import React, { useState, useEffect } from "react";
import "../Layout/Sidebar.css";
import { useUser } from "../context/UserContext";

interface Project {
  id: number;
  project_naam: string;
}

interface SidebarProps {
  onProjectSelect: (projectId: number) => void;
  onViewChange: (view: string) => void; // Nieuwe prop om de view te veranderen
}

const Sidebar: React.FC<SidebarProps> = ({ onProjectSelect, onViewChange }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const { user } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${backendUrl}/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        if (user && user.role === "admin") {
          setProjects(data);
        } else if (user && user.projects) {
          const userProjects = data.filter((project: Project) =>
            user.projects.includes(project.id)
          );
          setProjects(userProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [backendUrl, user]);

  return (
    <div className="sidebar">
      <h3>Projects</h3>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => {
              onProjectSelect(project.id);
              onViewChange("projects"); // Zorg dat de view wordt gewijzigd
            }}
          >
            {project.project_naam}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
