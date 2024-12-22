import React, { useState, useEffect } from "react";
import "../Layout/Sidebar.css";
import { useUser } from "../context/UserContext";
import axios from "axios";

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
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState<string>("");
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
            user.projects?.includes(project.id)
          );
          setProjects(userProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [backendUrl, user]);

  const addProject = () => {
    const project_naam = "Nieuw project";
    if (project_naam) {
      axios
        .post(`${backendUrl}/projects`, { project_naam })
        .then((response) => {
          setProjects((prevProjects) => [...prevProjects, response.data]);
        });
    }
  };

  const startEditing = (projectId: number, projectName: string) => {
    setEditingProjectId(projectId);
    setNewProjectName(projectName); // Zet de naam in het invoerveld
  };

  const saveProjectName = (projectId: number) => {
    if (newProjectName.trim() === "") return;

    axios
      .put(`${backendUrl}/projects/${projectId}`, {
        project_naam: newProjectName,
      })
      .then((response) => {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? { ...project, project_naam: newProjectName }
              : project
          )
        );
        setEditingProjectId(null); // Stop met bewerken
      })
      .catch((error) => {
        console.error("Error updating project:", error);
      });
  };

  const handleBlur = (projectId: number) => {
    saveProjectName(projectId); // Sla de wijziging op wanneer de gebruiker de focus verliest
  };

  const deleteProject = (projectId: number) => {
    const confirmed = window.confirm(
      "Weet je zeker dat je dit project wilt verwijderen?"
    );
    if (confirmed) {
      axios
        .delete(`${backendUrl}/projects/${projectId}`)
        .then(() => {
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.id !== projectId)
          );
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
        });
    }
  };

  return (
    <div className="sidebar">
      <div className="flex">
        <h3>Projecten</h3>
        {user && user.role === "admin" && (
          <>
            <button onClick={addProject}>+</button>
          </>
        )}
      </div>
      <ul>
        {projects.map((project) => (
          <li
            className="flex"
            key={project.id}
            onClick={() => {
              onProjectSelect(project.id);
              onViewChange("projects"); // Zorg dat de view wordt gewijzigd
            }}
          >
            {editingProjectId === project.id ? (
              <input
                className="edit-project-input"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onBlur={() => handleBlur(project.id)} // Sla op wanneer de gebruiker uit het invoerveld klikt
                autoFocus
              />
            ) : (
              <span>{project.project_naam}</span>
            )}
            {user && user.role === "admin" && (
              <>
                {editingProjectId === project.id ? null : (
                  <>
                    <div className="flex">
                      <button
                        className="edit-project-button"
                        onClick={() =>
                          startEditing(project.id, project.project_naam)
                        }
                      >
                        <i className="fas fa-pencil-alt"></i>{" "}
                        {/* Potlood icoon */}
                      </button>
                      <button
                        className="delete-project-button"
                        onClick={() => deleteProject(project.id)}
                      >
                        <i className="fas fa-trash-alt"></i>{" "}
                        {/* Vuilbak icoon */}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
