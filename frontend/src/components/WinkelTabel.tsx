import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../Layout/TabelWinkels.css";

interface Winkel {
  id: number;
  naam: string;
  link: string;
}

const WinkelTable: React.FC = () => {
  const [winkels, setWinkels] = useState<Winkel[]>([]);
  const [newWinkel, setNewWinkel] = useState({ naam: "", link: "" });
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Haal bestaande winkels op
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
  ];

  // Functie voor het toevoegen van een nieuwe winkel
  const handleAddWinkel = () => {
    if (!newWinkel.naam || !newWinkel.link) {
      alert("Voer een naam en een link in.");
      return;
    }

    axios
      .post(`${backendUrl}/winkels`, newWinkel)
      .then((response) => {
        console.log("Winkel added:", response.data);
        setWinkels((prevWinkels) => [...prevWinkels, response.data]);
        setNewWinkel({ naam: "", link: "" }); // Reset formulier
      })
      .catch((error) => {
        console.error("Error adding winkel:", error);
      });
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
          <button onClick={handleAddWinkel}>Voeg toe</button>
        </div>
        <DataTable
          title="Winkel List"
          columns={columns}
          data={winkels}
          pagination
        />
      </div>
    </div>
  );
};

export default WinkelTable;
