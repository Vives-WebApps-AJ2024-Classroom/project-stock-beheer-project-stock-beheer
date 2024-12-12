import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import "../Layout/Table.css";
import { AddOrder, OrderFormData } from "./AddOrder";
import { useUser } from "../context/UserContext";
import axios from "axios";

interface Row {
  ID: number;
  Leveringsadres: string;
  Datum_aanvraag: string;
  Aantal: number;
  Korte_omschrijving: string;
  Winkel: string;
  Artikelnummer: string;
  URL: string;
  Totale_kostprijs_excl_BTW: number;
  Aangevraagd_door: string;
  Aantal_dagen_levertijd: number;
  Status: string;
  Gekeurd_door_coach: string;
  Bestelling_ingegeven_RQ_nummer: string;
  Bestelling_door_financ_dienst_geplaatst: string;
  Bestelling_verzonden_verwachtte_aankomst: string;
  Bestelling_ontvangen_datum: string;
  Opmerkingen: string;
  project_id: number;
}

function ProjectTable({ selectedProjectId }: { selectedProjectId: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { user } = useUser();
  interface Project {
    id: number;
    project_naam: string;
  }

  const [totaleKost, setTotaleKost] = useState<number>(0);
  const [project, setProject] = useState<Project | null>(null);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const fetchData = useCallback(async () => {
    const url =
      selectedProjectId === -1
        ? `${backendUrl}/products`
        : `${backendUrl}/projects/${selectedProjectId}/products`;
    console.log(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();

      let totalCost = 0;
      data.forEach((item: Row) => {
        totalCost += Number(item.Totale_kostprijs_excl_BTW);
      });
      setTotaleKost(totalCost);
      const filteredData =
        selectedProjectId !== -1
          ? data.filter((item: Row) => item.project_id === selectedProjectId)
          : data;
      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId !== 0) {
      fetchData();
    }
  }, [selectedProjectId, fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch data from API");
        }
        const data = await response.json();
        const projectData = data.find(
          (item: any) => item.id === selectedProjectId
        );
        setProject(projectData || null);
        setProject(data.find((item: any) => item.id === selectedProjectId));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (selectedProjectId !== 0) {
      fetchData();
    }
  }, [selectedProjectId, backendUrl]);

  interface UpdateStatusParams {
    row: Row;
    status: string;
  }

  const updateStatus = async ({
    row,
    status,
  }: UpdateStatusParams): Promise<void> => {
    try {
      await axios.put(`${backendUrl}/products/${row.ID}`, {
        ...row,
        Status: status,
        Gekeurd_door_coach: user?.name || user?.login || "Unknown",
      });
      fetchData();
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
      alert(
        `Er is een fout opgetreden bij het wijzigen van de status naar ${status}.`
      );
    }
  };

  const columns = [
    {
      name: "Status",
      selector: (row: Row) => row.Status,
      sortable: true,
      cell: (row: Row) => (
        <div>
          {user?.role === "student" && (
            <div title={row.Status.toString()} className="status">
              {row.Status === "Afwachting" && (
                <i className="fa-solid fa-clock" />
              )}
              {row.Status === "Gekeurd" && <i className="fas fa-check" />}
              {row.Status === "Afgekeurd" && <i className="fas fa-times" />}
              {!row.Status && <span>Nog niet beoordeeld</span>}
            </div>
          )}
          {(user?.role === "teacher" || user?.role === "admin") && (
            <div className="status-buttons status">
              <i
                className={`fa-solid fa-clock ${
                  row.Status === "Afwachting" ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => updateStatus({ row, status: "Afwachting" })}
              />
              <i
                className={`fas fa-check ${
                  row.Status === "Gekeurd" ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => updateStatus({ row, status: "Gekeurd" })}
              />
              <i
                className={`fas fa-times ${
                  row.Status === "Afgekeurd" ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => updateStatus({ row, status: "Afgekeurd" })}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Leveringsadres",
      selector: (row: Row) => row.Leveringsadres,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Leveringsadres}>{row.Leveringsadres}</div>
      ),
    },
    {
      name: "Datum aanvraag",
      selector: (row: Row) => row.Datum_aanvraag,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Datum_aanvraag}>{row.Datum_aanvraag}</div>
      ),
    },
    {
      name: "Aantal",
      selector: (row: Row) => row.Aantal,
      sortable: true,
      cell: (row: Row) => <div title={row.Aantal.toString()}>{row.Aantal}</div>,
    },
    {
      name: "Korte omschrijving",
      selector: (row: Row) => row.Korte_omschrijving,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Korte_omschrijving}>{row.Korte_omschrijving}</div>
      ),
    },
    {
      name: "Winkel",
      selector: (row: Row) => row.Winkel,
      sortable: true,
      cell: (row: Row) => <div title={row.Winkel}>{row.Winkel}</div>,
    },
    {
      name: "Artikelnummer",
      selector: (row: Row) => row.Artikelnummer,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Artikelnummer}>{row.Artikelnummer}</div>
      ),
    },
    {
      name: "URL",
      selector: (row: Row) => row.URL,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.URL}>
          <a href={row.URL} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </div>
      ),
    },
    {
      name: "Totale kostprijs excl. BTW",
      selector: (row: Row) => row.Totale_kostprijs_excl_BTW,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Totale_kostprijs_excl_BTW.toString()}>
          {row.Totale_kostprijs_excl_BTW}
        </div>
      ),
    },
    {
      name: "Aangevraagd door",
      selector: (row: Row) => row.Aangevraagd_door,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Aangevraagd_door}>{row.Aangevraagd_door}</div>
      ),
    },
    {
      name: "Aantal dagen levertijd",
      selector: (row: Row) => row.Aantal_dagen_levertijd,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Aantal_dagen_levertijd.toString()}>
          {row.Aantal_dagen_levertijd}
        </div>
      ),
    },

    {
      name: "Gekeurd door coach",
      selector: (row: Row) => row.Gekeurd_door_coach,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Gekeurd_door_coach}>
          {row.Gekeurd_door_coach || "Niet beschikbaar"}
        </div>
      ),
    },
    {
      name: "Bestelling ingegeven RQ nummer",
      selector: (row: Row) => row.Bestelling_ingegeven_RQ_nummer,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_ingegeven_RQ_nummer}>
          {row.Bestelling_ingegeven_RQ_nummer || "Niet beschikbaar"}
        </div>
      ),
    },
    {
      name: "Bestelling door financieel dienst geplaatst",
      selector: (row: Row) => row.Bestelling_door_financ_dienst_geplaatst,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_door_financ_dienst_geplaatst}>
          {row.Bestelling_door_financ_dienst_geplaatst}
        </div>
      ),
    },
    {
      name: "Bestelling verzonden (verwachte aankomst)",
      selector: (row: Row) => row.Bestelling_verzonden_verwachtte_aankomst,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_verzonden_verwachtte_aankomst}>
          {row.Bestelling_verzonden_verwachtte_aankomst}
        </div>
      ),
    },
    {
      name: "Bestelling ontvangen datum",
      selector: (row: Row) => row.Bestelling_ontvangen_datum,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_ontvangen_datum}>
          {row.Bestelling_ontvangen_datum}
        </div>
      ),
    },
    {
      name: "Opmerkingen",
      selector: (row: Row) => row.Opmerkingen,
      sortable: true,
      cell: (row: Row) => <div title={row.Opmerkingen}>{row.Opmerkingen}</div>,
    },
  ];

  const handleOrderAdd = () => {
    setIsPopupOpen(true);
  };

  const handleCloseOrder = () => {
    setIsPopupOpen(false);
  };

  const handleSaveOrder = async (data: OrderFormData) => {
    try {
      const newOrder = {
        ...data,
        project_id: selectedProjectId,
        Leveringsadres: "Vives",
        Datum_aanvraag: new Date()
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-"),
        Aangevraagd_door: user?.name || user?.login || "Unknown",
        Status: "Afwachting", // Boolean veld correct ingesteld
        Gekeurd_door_coach: null, // Boolean veld correct ingesteld
        Bestelling_ingegeven_RQ_nummer: null, // Null voor optionele velden
        Bestelling_door_financ_dienst_geplaatst: false, // Boolean veld correct ingesteld
        Bestelling_verzonden_verwachtte_aankomst: null,
        Bestelling_ontvangen_datum: null,
      };
      await axios.post(`${backendUrl}/products`, newOrder);
      await fetchData(); // Zorgt dat nieuwe data direct geladen wordt
      setIsPopupOpen(false); // Sluit popup na succesvol opslaan
    } catch (error) {
      console.error("Error saving order:", error);
      alert(
        "Er is een fout opgetreden bij het opslaan van de bestelling. Probeer opnieuw."
      );
    }
  };

  const filteredRows = rows.filter((row) => {
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div className="container my-5">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {selectedProjectId !== -1 ? (
              <div className="flex">
                <h1>Project: {project ? project.project_naam : "N/A"}</h1>
                <button onClick={handleOrderAdd} className="btn btn-primary">
                  Bestelling toevoegen
                </button>
              </div>
            ) : (
              <h1>Alle bestellingen</h1>
            )}
            <div>
              <h5>Totale kostprijs excl. BTW:</h5>
              <h2>€{totaleKost}</h2>
            </div>
            <input
              type="text"
              placeholder="Zoek op project, leveringsadres, omschrijving..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                marginBottom: "20px",
                padding: "8px",
                width: "100%",
                maxWidth: "500px",
              }}
            />
            <DataTable
              columns={columns}
              data={filteredRows}
              pagination
              subHeader
              fixedHeader
            />
            {isPopupOpen && (
              <AddOrder onClose={handleCloseOrder} onSave={handleSaveOrder} />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectTable;
