import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import "../Layout/Table.css";
import { ViewOrder, OrderFormData } from "./ViewOrder";
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

interface ColumnFilters {
  [key: string]: string;
}

function ProjectTable({ selectedProjectId }: { selectedProjectId: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    Leveringsadres: "false",
    Datum_aanvraag: "true",
    Aantal: "true",
    Korte_omschrijving: "true",
    Winkel: "true",
    Artikelnummer: "false",
    URL: "false",
    Totale_kostprijs_excl_BTW: "true",
    Aangevraagd_door: "true",
    Aantal_dagen_levertijd: "false",
    Status: "true",
    Gekeurd_door_coach: "false",
    Bestelling_ingegeven_RQ_nummer: "false",
    Bestelling_door_financ_dienst_geplaatst: "false",
    Bestelling_verzonden_verwachtte_aankomst: "false",
    Bestelling_ontvangen_datum: "true",
    Opmerkingen: "true",
  });
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [state, setState] = useState("view");
  const [selectedRow, setSelectedRow] = useState<Row | undefined>(undefined);

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
      omit: columnFilters.Status === "false",
      cell: (row: Row) => (
        <div className="status">
          {row.Bestelling_ontvangen_datum.trim() !== "" ? (
            <i className="fa-solid fa-box" />
          ) : row.Bestelling_verzonden_verwachtte_aankomst.trim() !== "" ? (
            <i className="fa-solid fa-truck-fast" />
          ) : (
            <>
              {(user?.role === "teacher" || user?.role === "admin") &&
              row.Bestelling_ingegeven_RQ_nummer.trim() === "" ? (
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
                      row.Status === "Goedgekeurd" ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateStatus({ row, status: "Goedgekeurd" })}
                  />
                  <i
                    className={`fas fa-times ${
                      row.Status === "Afgekeurd" ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateStatus({ row, status: "Afgekeurd" })}
                  />
                </div>
              ) : (
                <div title={row.Status.toString()}>
                  {row.Status === "Afwachting" && (
                    <i className="fa-solid fa-clock" />
                  )}
                  {row.Status === "Goedgekeurd" && (
                    <i className="fas fa-check" />
                  )}
                  {row.Status === "Afgekeurd" && <i className="fas fa-times" />}
                  {!row.Status && <span>Nog niet beoordeeld</span>}
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      name: "Leveringsadres",
      selector: (row: Row) => row.Leveringsadres,
      sortable: true,
      omit: columnFilters.Leveringsadres === "false",
      cell: (row: Row) => (
        <div title={row.Leveringsadres}>{row.Leveringsadres}</div>
      ),
    },
    {
      name: "Datum aanvraag",
      selector: (row: Row) => row.Datum_aanvraag,
      sortable: true,
      omit: columnFilters.Datum_aanvraag === "false",
      cell: (row: Row) => (
        <div title={row.Datum_aanvraag}>{row.Datum_aanvraag}</div>
      ),
    },
    {
      name: "Aantal",
      selector: (row: Row) => row.Aantal,
      sortable: true,
      omit: columnFilters.Aantal === "false",
      cell: (row: Row) => <div title={row.Aantal.toString()}>{row.Aantal}</div>,
    },
    {
      name: "Korte omschrijving",
      selector: (row: Row) => row.Korte_omschrijving,
      sortable: true,
      omit: columnFilters.Korte_omschrijving === "false",
      cell: (row: Row) => (
        <div title={row.Korte_omschrijving}>{row.Korte_omschrijving}</div>
      ),
    },
    {
      name: "Winkel",
      selector: (row: Row) => row.Winkel,
      sortable: true,
      omit: columnFilters.Winkel === "false",
      cell: (row: Row) => <div title={row.Winkel}>{row.Winkel}</div>,
    },
    {
      name: "Artikelnummer",
      selector: (row: Row) => row.Artikelnummer,
      sortable: true,
      omit: columnFilters.Artikelnummer === "false",
      cell: (row: Row) => (
        <div title={row.Artikelnummer}>{row.Artikelnummer}</div>
      ),
    },
    {
      name: "URL",
      selector: (row: Row) => row.URL,
      sortable: true,
      omit: columnFilters.URL === "false",
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
      omit: columnFilters.Totale_kostprijs_excl_BTW === "false",
      cell: (row: Row) => (
        <div title={row.Totale_kostprijs_excl_BTW.toString()}>
          € {row.Totale_kostprijs_excl_BTW}
        </div>
      ),
    },
    {
      name: "Aangevraagd door",
      selector: (row: Row) => row.Aangevraagd_door,
      sortable: true,
      omit: columnFilters.Aangevraagd_door === "false",
      cell: (row: Row) => (
        <div title={row.Aangevraagd_door}>{row.Aangevraagd_door}</div>
      ),
    },
    {
      name: "Aantal dagen levertijd",
      selector: (row: Row) => row.Aantal_dagen_levertijd,
      sortable: true,
      omit: columnFilters.Aantal_dagen_levertijd === "false",
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
      omit: columnFilters.Gekeurd_door_coach === "false",
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
      omit: columnFilters.Bestelling_ingegeven_RQ_nummer === "false",
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
      omit: columnFilters.Bestelling_door_financ_dienst_geplaatst === "false",
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
      omit: columnFilters.Bestelling_verzonden_verwachtte_aankomst === "false",
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
      omit: columnFilters.Bestelling_ontvangen_datum === "false",
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
      omit: columnFilters.Opmerkingen === "false",
      cell: (row: Row) => <div title={row.Opmerkingen}>{row.Opmerkingen}</div>,
    },
  ];

  const handleOrderView = (state: string, row: Row) => {
    setState(state);
    setSelectedRow(row);
    setIsPopupOpen(true);
  };

  const handleCloseOrder = () => {
    setIsPopupOpen(false);
  };

  const handleSaveOrder = async (data: OrderFormData, state: string) => {
    try {
      const order = {
        ...data,
        project_id: data.project_id === 0 ? selectedProjectId : data.project_id,
        Bestelling_door_financ_dienst_geplaatst:
          data.Bestelling_door_financ_dienst_geplaatst === "Ja" ? true : false,
      };
      if (data.Bestelling_verzonden_verwachtte_aankomst.trim() !== "")
        order.Status = "Verzonden";
      if (data.Bestelling_ontvangen_datum.trim() !== "")
        order.Status = "Ontvangen";
      console.log(order);
      if (state === "new") {
        await axios.post(`${backendUrl}/products`, order);
      } else {
        await axios.put(`${backendUrl}/products/${data.ID}`, order);
      }
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
    const terms = searchTerm.toLowerCase().split(",");
    return terms.every((term) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(term.trim())
      )
    );
  });

  const toggleColumnFilter = (key: string) => {
    setColumnFilters({
      ...columnFilters,
      [key]: columnFilters[key] === "true" ? "false" : "true",
    });
  };

  return (
    <>
      <div className="container my-5" onClick={() => setColumnMenuOpen(false)}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {selectedProjectId !== -1 ? (
              <div className="flex">
                <h1>Project: {project ? project.project_naam : "N/A"}</h1>
                <button
                  onClick={() => handleOrderView("new", {} as Row)}
                  className="btn btn-primary"
                >
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
            <div className="flex">
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
              <div style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setColumnMenuOpen((prev) => !prev);
                  }}
                  className="btn btn-secondary"
                >
                  Kolommen
                </button>
                {columnMenuOpen && (
                  <div
                    className="column-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {Object.keys(columnFilters).map((key) => (
                      <div key={key} style={{ marginBottom: "5px" }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={columnFilters[key] === "true"}
                            onChange={() => toggleColumnFilter(key)}
                          />
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filteredRows}
              defaultSortFieldId={3}
              defaultSortAsc={false}
              pagination
              subHeader
              fixedHeader
              onRowClicked={(row) => handleOrderView("view", row)}
            />
            {isPopupOpen && (
              <ViewOrder
                onClose={handleCloseOrder}
                onSave={handleSaveOrder}
                _state={state}
                admin={user?.role === "admin"}
                row={selectedRow}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectTable;
