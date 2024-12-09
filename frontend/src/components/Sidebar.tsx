import React, { useState, useEffect } from "react";
import "../Layout/Sidebar.css";

interface Project {
  id: number;
  project_naam: string;
}

const Sidebar: React.FC<{ onProjectSelect: (projectId: number) => void }> = ({
  onProjectSelect
}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="sidebar">
      <h3>Projects</h3>
      <ul>
        {projects.map((project) => (
          <li key={project.id} onClick={() => onProjectSelect(project.id)}>
            {project.project_naam}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
