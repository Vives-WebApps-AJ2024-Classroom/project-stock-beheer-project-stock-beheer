import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import ProjectSelectionPopup from "./ProjectSelectionPopup";

interface User {
  id: number;
  name: string;
  role: string;
  projects: number[];
}

interface Project {
  id: number;
  project_naam: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Haal gebruikers op
  useEffect(() => {
    axios
      .get(`${backendUrl}/users`)
      .then((response) => {
        console.log("Fetched users:", response.data);
        const user = response.data;
        const parsedUser = {
          ...user,
          projects: user.projects
            .split(",")
            .map((projectId: string) => Number(projectId.trim())),
        };
        setUsers([parsedUser]);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [backendUrl]);

  // Haal projecten op
  useEffect(() => {
    axios
      .get(`${backendUrl}/projects`)
      .then((response) => {
        console.log("Fetched projects:", response.data);
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [backendUrl]);

  // Genereer kolommen voor de DataTable
  const columns = [
    {
      name: "ID",
      selector: (row: User) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: User) => row.role,
      sortable: true,
    },
    {
      name: "Projects",
      cell: (row: User) => (
        <div
          onClick={() => handleProjectClick(row)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {row.projects.join(", ")}
        </div>
      ),
      sortable: false,
    },
  ];

  // Functie voor het openen van de popup
  const handleProjectClick = (user: User) => {
    setSelectedUser(user);
    setSelectedProjects(user.projects); // Laad de geselecteerde projecten voor de gebruiker
    setIsPopupOpen(true);
  };

  // Functie om de geselecteerde projecten bij te werken in de lokale state
  const handleCheckboxChange = (selectedProjectIds: number[]) => {
    setSelectedProjects(selectedProjectIds);
  };

  // Functie om de geselecteerde projecten op te slaan in de server
  const handleSaveProjects = () => {
    if (selectedUser) {
      const projectString = selectedProjects.join(",");
      axios
        .put(`${backendUrl}/users/${selectedUser.id}`, {
          projects: projectString,
        })
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id
                ? { ...user, projects: selectedProjects }
                : user
            )
          );
          setIsPopupOpen(false); // Sluit de popup na opslaan
        })
        .catch((error) => {
          console.error("Failed to update user projects:", error);
        });
    }
  };

  // Functie om de popup te sluiten zonder op te slaan
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <DataTable title="User List" columns={columns} data={users} />
      {isPopupOpen && selectedUser && (
        <ProjectSelectionPopup
          projects={projects}
          selectedProjects={selectedProjects}
          onSelectProjects={handleCheckboxChange} // Bijwerken van geselecteerde projecten lokaal
          onClose={handleClosePopup} // Sluit de popup
          onSave={handleSaveProjects} // Voer de save uit bij klikken op de knop
        />
      )}
    </div>
  );
};

export default UserTable;
