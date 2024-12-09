import React, { useState, useEffect } from "react";
import "../Layout/Sidebar.css";

// Interface voor een projectobject
interface Project {
  id: number;
  project_naam: string;
}

const Sidebar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Data ophalen van de API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/projects");
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }
        const data: Project[] = await response.json();
        setProjects(data); // Zet de opgehaalde data in de state
        setLoading(false); // Zet de loading state uit
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="sidebar">
      <h3>Projects</h3>
      {loading && <p>Loading projects...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <button className="project-button">{project.project_naam}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
