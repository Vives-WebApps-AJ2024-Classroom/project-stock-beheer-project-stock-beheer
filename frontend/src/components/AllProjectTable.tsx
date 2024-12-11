import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../Layout/Table.css";

interface Row {
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
  Goedgekeurd_door_coach: string;
  Bestelling_ingegeven_RQ_nummer: string;
  Bestelling_door_financ_dienst_geplaatst: string;
  Bestelling_verzonden_verwachtte_aankomst: string;
  Bestelling_ontvangen_datum: string;
  Opmerkingen: string;
  project_id: number;
  project_naam: string; // Voor projectnamen
}

function AllProjectsTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totaleKost, setTotaleKost] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders from API");
        }
        const data = await response.json();
        let totalCost = 0;
        data.forEach((item: Row) => {
          totalCost += Number(item.Totale_kostprijs_excl_BTW);
        });
        setTotaleKost(totalCost);
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  // Filteren van de rows op basis van de zoekterm
  const filteredRows = rows.filter((row) => {
    return (
      row.project_naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Leveringsadres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Korte_omschrijving.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Winkel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Artikelnummer.toLowerCase().includes(searchTerm.toLowerCase())||
      row.Aangevraagd_door.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      name: "Project",
      selector: (row: Row) => row.project_naam,
      sortable: true,
      cell: (row: Row) => <div title={row.project_naam}>{row.project_naam}</div>,
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
        <div title={row.Datum_aanvraag}>
          {new Date(row.Datum_aanvraag).toLocaleString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
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
      name: "Goedgekeurd door coach",
      selector: (row: Row) => row.Goedgekeurd_door_coach,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Goedgekeurd_door_coach}>
          {row.Goedgekeurd_door_coach}
        </div>
      ),
    },
    {
      name: "Bestelling ingegeven RQ nummer",
      selector: (row: Row) => row.Bestelling_ingegeven_RQ_nummer,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_ingegeven_RQ_nummer}>
          {row.Bestelling_ingegeven_RQ_nummer}
        </div>
      ),
    },
    {
      name: "Bestelling door financieel dienst geplaatst",
      selector: (row: Row) => row.Bestelling_door_financ_dienst_geplaatst,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_door_financ_dienst_geplaatst}>
          {new Date(row.Bestelling_door_financ_dienst_geplaatst).toLocaleString(
            "nl-NL",
            {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </div>
      ),
    },
    {
      name: "Bestelling verzonden (verwachte aankomst)",
      selector: (row: Row) => row.Bestelling_verzonden_verwachtte_aankomst,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_verzonden_verwachtte_aankomst}>
          {new Date(
            row.Bestelling_verzonden_verwachtte_aankomst
          ).toLocaleString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      name: "Bestelling ontvangen datum",
      selector: (row: Row) => row.Bestelling_ontvangen_datum,
      sortable: true,
      cell: (row: Row) => (
        <div title={row.Bestelling_ontvangen_datum}>
          {new Date(row.Bestelling_ontvangen_datum).toLocaleString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
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

  return (
    <div className="container my-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Overzicht van alle bestellingen</h1>
          <div>
            <h5>Totale kostprijs excl. BTW:</h5>
            <h2>€{totaleKost}</h2>
          </div>

          {/* Zoekveld voor filteren */}
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

          {/* Tabelweergave */}
          <DataTable
            columns={columns}
            data={filteredRows} // Toon alleen gefilterde rijen
            pagination
            fixedHeader
            title="Alle bestellingen"
          />
        </div>
      )}
    </div>
  );
}

export default AllProjectsTable;
