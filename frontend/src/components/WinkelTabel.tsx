import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../Layout/TabelWinkels.css";
import { useUser } from "../context/UserContext"; // Zorg ervoor dat je user context importeert

interface Winkel {
  id: number;
  naam: string;
  link: string;
  project_id: number | null; // project_id kan nu zowel number als null zijn
}

interface Project {
  id: number;
  project_naam: string;
}

const WinkelTable: React.FC = () => {
  const { user } = useUser(); // Haal de ingelogde gebruiker op uit de context
  const [winkels, setWinkels] = useState<Winkel[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Voor projecten
  const [selectedProject, setSelectedProject] = useState<number | string>(""); // Houdt het geselecteerde project bij
  const [newWinkel, setNewWinkel] = useState({
    naam: "",
    link: "",
    project_id: null as number | null,
  }); // initialiseer project_id als null
  const backendPort = process.env.REACT_APP_BACKEND_PORT;
  const backendUrl = process.env.REACT_APP_BACKEND_URL + ":" + backendPort;

  useEffect(() => {
    document.title = `Stock Beheer | Winkels`;
  }, []);

  // Haal de winkels op van de backend
  useEffect(() => {
    axios
      .get(`${backendUrl}/winkels`)
      .then((response) => {
        console.log("Fetched winkels:", response.data);
        setWinkels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching winkels:", error);
      });
  }, [backendUrl]);

  // Haal de projecten op, gefilterd op basis van de projecten waaraan de teacher is gekoppeld
  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          // Haal alle projecten op
          const response = await axios.get(`${backendUrl}/projects`);
          console.log("Fetched projects:", response.data); // Log de opgehaalde projecten

          // Als de gebruiker een admin is, kan hij alle projecten zien
          if (user.role === "admin") {
            setProjects(response.data);
          } else {
            // Voor een teacher, filter de projecten waaraan hij gekoppeld is
            const userProjects = response.data.filter((project: Project) =>
              user.projects?.includes(project.id)
            );
            console.log("Filtered projects for teacher:", userProjects); // Log de gefilterde projecten
            setProjects(userProjects);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjects();
    }
  }, [user, backendUrl]);

  // Genereer kolommen voor de DataTable
  const columns = [
    {
      name: "Naam",
      selector: (row: Winkel) => row.naam,
      sortable: true,
    },
    {
      name: "Link",
      cell: (row: Winkel) => (
        <a href={row.link} target="_blank" rel="noopener noreferrer">
          {row.link}
        </a>
      ),
      sortable: false,
    },
    {
      name: "Project",
      selector: (row: Winkel) => {
        // Zoeken naar het project dat is gekoppeld aan de winkel
        const project = projects.find(
          (project) => project.id === row.project_id
        );
        return project ? project.project_naam : "Alle projecten"; // Als er geen project is gekoppeld, toon een placeholder
      },
      sortable: true,
    },
  ];

  // Functie voor het toevoegen van een nieuwe winkel
  const handleAddWinkel = () => {
    if (!newWinkel.naam || !newWinkel.link) {
      alert("Voer een naam en een link in.");
      return;
    }

    // Als de gebruiker een teacher is en geen project heeft geselecteerd, geef dan een waarschuwing
    if (user?.role === "teacher" && !newWinkel.project_id) {
      alert("Selecteer een project voordat je een winkel toevoegt.");
      return;
    }

    // Hier sturen we ook project_id mee naar de backend
    axios
      .post(`${backendUrl}/winkels`, newWinkel)
      .then((response) => {
        console.log("Winkel added:", response.data);
        setWinkels((prevWinkels) => [...prevWinkels, response.data]);
        setNewWinkel({ naam: "", link: "", project_id: null }); // Reset formulier met null als project_id
      })
      .catch((error) => {
        console.error("Error adding winkel:", error);
      });
  };

  // Handle de selectie van een project uit de dropdown
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedProject(selectedValue);

    // Als de admin "alle projecten" selecteert, stel project_id in op null
    if (selectedValue === "") {
      setNewWinkel({ ...newWinkel, project_id: null });
    } else {
      setNewWinkel({ ...newWinkel, project_id: parseInt(selectedValue) });
    }
  };

  return (
    <div>
      <div className="container my-5">
        <div style={{ marginBottom: "20px" }}>
          <h3>Voeg een nieuwe winkel toe</h3>
          <input
            type="text"
            placeholder="Naam"
            value={newWinkel.naam}
            onChange={(e) =>
              setNewWinkel({ ...newWinkel, naam: e.target.value })
            }
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Link"
            value={newWinkel.link}
            onChange={(e) =>
              setNewWinkel({ ...newWinkel, link: e.target.value })
            }
            style={{ marginRight: "10px" }}
          />

          {/* Dropdown voor projecten */}
          <select
            value={selectedProject}
            onChange={handleProjectSelect}
            style={{ margin: "10px" }}
          >
            <option value="" disabled hidden>
              Selecteer een project
            </option>
            {/* Voeg een extra optie toe voor "Alle projecten" als de gebruiker een admin is */}
            {user?.role === "admin" && (
              <option value="Alle projecten">Alle projecten</option>
            )}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_naam}
              </option>
            ))}
          </select>

          <button onClick={handleAddWinkel}>Voeg toe</button>
        </div>

        {/* Tabel van winkels */}
        <DataTable
          title="Winkels"
          columns={columns}
          data={winkels}
          pagination
        />
      </div>
    </div>
  );
};

export default WinkelTable;
