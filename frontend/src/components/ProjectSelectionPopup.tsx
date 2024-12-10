import React from "react";
import "../Layout/Popup.css";

interface Project {
  id: number;
  project_naam: string;
}

interface ProjectSelectionPopupProps {
  projects: Project[];
  selectedProjects: number[];
  onSelectProjects: (selectedProjectIds: number[]) => void;
  onClose: () => void;
  onSave: () => void; // Toegevoegd om de save-functie door te geven
}

const ProjectSelectionPopup: React.FC<ProjectSelectionPopupProps> = ({
  projects,
  selectedProjects,
  onSelectProjects,
  onClose,
  onSave,
}) => {
  const handleCheckboxChange = (projectId: number) => {
    const updatedSelectedProjects = selectedProjects.includes(projectId)
      ? selectedProjects.filter((id) => id !== projectId)
      : [...selectedProjects, projectId];
    onSelectProjects(updatedSelectedProjects);
  };

  return (
    <div className="project-popup-overlay">
      <div className="project-popup">
        <h3>Select Projects</h3>
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id}>
              <input
                type="checkbox"
                checked={selectedProjects.includes(project.id)}
                onChange={() => handleCheckboxChange(project.id)}
              />
              <label>{project.project_naam}</label>
            </div>
          ))}
        </div>

        {/* Knoppen binnen de popup */}
        <div className="popup-actions">
          <button onClick={onSave}>Save Projects</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectionPopup;
