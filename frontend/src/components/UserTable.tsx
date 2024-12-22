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

  useEffect(() => {
    document.title = `Stock Beheer | Gebruikers`;
  }, []);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Haal gebruikers op
  useEffect(() => {
    axios
      .get(`${backendUrl}/users`)
      .then((response) => {
        const parsedUsers = response.data.map((user: any) => ({
          ...user,
          id: user.ID,
          name: user.displayname,
          projects: user.project_ids
            ? user.project_ids
                .split(",")
                .map((projectId: string) => Number(projectId.trim()))
            : [],
        }));
        console.log("Fetched users:", parsedUsers);
        setUsers(parsedUsers);
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
      name: "Naam",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Rol",
      cell: (row: User) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          defaultValue={row.role}
        >
          <option value="admin">admin</option>
          <option value="teacher">teacher</option>
          <option value="student">student</option>
        </select>
      ),
      sortable: true,
    },
    {
      name: "Projecten",
      cell: (row: User) => {
        // Filter projecten op basis van de bestaande project-ID's en toon de projectnamen
        const validProjects = row.projects
          .map((projectId) =>
            projects.find((project) => project.id === projectId)
          )
          .filter((project) => project !== undefined);

        return (
          <div
            onClick={() => handleProjectClick(row)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {validProjects.length > 0
              ? validProjects.map((project) => project?.project_naam).join(", ")
              : "geen"}
          </div>
        );
      },
      sortable: false,
    },
    {
      name: "Verwijderen",
      cell: (row: User) => (
        <button
          onClick={() => handleDeleteUser(row.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "red",
            cursor: "pointer",
          }}
        >
          <i className="fas fa-trash"></i> {/* Font Awesome vuilbak icoon */}
        </button>
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

  const handleRoleChange = (userId: number, newRole: string) => {
    axios
      .put(`${backendUrl}/users/${userId}`, {
        role: newRole,
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update user role:", error);
      });
  };

  // Functie om een gebruiker te verwijderen
  const handleDeleteUser = (userId: number) => {
    if (
      window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")
    ) {
      axios
        .delete(`${backendUrl}/users/${userId}`)
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
        })
        .catch((error) => {
          console.error("Failed to delete user:", error);
        });
    }
  };

  // Functie om de geselecteerde projecten op te slaan in de server
  const handleSaveProjects = () => {
    if (selectedUser) {
      const projectString =
        selectedProjects.length > 0 ? selectedProjects.join(",") : "0";
      axios
        .put(`${backendUrl}/users/${selectedUser.id}`, {
          projects: projectString || "",
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
    <div className="container my-5">
      <DataTable title="Gebruikers" columns={columns} data={users} pagination />
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
