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
  Totaalprijs_project: number;
  project_id: number;
}

function Table({ selectedProjectId }: { selectedProjectId: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/producten");
        if (!response.ok) {
          throw new Error("Failed to fetch data from API");
        }
        const data = await response.json();
        const filteredData = data.filter(
          (item: Row) => item.project_id === selectedProjectId
        );
        setRows(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProjectId !== 0) {
      fetchData();
    }
  }, [selectedProjectId]);

  const columns = [
    {
      name: "Leveringsadres",
      selector: (row: Row) => row.Leveringsadres,
      cell: (row: Row) => (
        <div title={row.Leveringsadres}>{row.Leveringsadres}</div>
      ),
    },
    {
      name: "Datum aanvraag",
      selector: (row: Row) => row.Datum_aanvraag,
      cell: (row: Row) => (
        <div title={row.Datum_aanvraag}>{row.Datum_aanvraag}</div>
      ),
    },
    {
      name: "Aantal",
      selector: (row: Row) => row.Aantal,
      cell: (row: Row) => <div title={row.Aantal.toString()}>{row.Aantal}</div>,
    },
    {
      name: "Korte omschrijving",
      selector: (row: Row) => row.Korte_omschrijving,
      cell: (row: Row) => (
        <div title={row.Korte_omschrijving}>{row.Korte_omschrijving}</div>
      ),
    },
    {
      name: "Winkel",
      selector: (row: Row) => row.Winkel,
      cell: (row: Row) => <div title={row.Winkel}>{row.Winkel}</div>,
    },
    {
      name: "Artikelnummer",
      selector: (row: Row) => row.Artikelnummer,
      cell: (row: Row) => (
        <div title={row.Artikelnummer}>{row.Artikelnummer}</div>
      ),
    },
    {
      name: "URL",
      selector: (row: Row) => row.URL,
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
      cell: (row: Row) => (
        <div title={row.Totale_kostprijs_excl_BTW.toString()}>
          {row.Totale_kostprijs_excl_BTW}
        </div>
      ),
    },
    {
      name: "Aangevraagd door",
      selector: (row: Row) => row.Aangevraagd_door,
      cell: (row: Row) => (
        <div title={row.Aangevraagd_door}>{row.Aangevraagd_door}</div>
      ),
    },
    {
      name: "Aantal dagen levertijd",
      selector: (row: Row) => row.Aantal_dagen_levertijd,
      cell: (row: Row) => (
        <div title={row.Aantal_dagen_levertijd.toString()}>
          {row.Aantal_dagen_levertijd}
        </div>
      ),
    },
    {
      name: "Goedgekeurd door coach",
      selector: (row: Row) => row.Goedgekeurd_door_coach,
      cell: (row: Row) => (
        <div title={row.Goedgekeurd_door_coach}>
          {row.Goedgekeurd_door_coach}
        </div>
      ),
    },
    {
      name: "Bestelling ingegeven RQ nummer",
      selector: (row: Row) => row.Bestelling_ingegeven_RQ_nummer,
      cell: (row: Row) => (
        <div title={row.Bestelling_ingegeven_RQ_nummer}>
          {row.Bestelling_ingegeven_RQ_nummer}
        </div>
      ),
    },
    {
      name: "Bestelling door financieel dienst geplaatst",
      selector: (row: Row) => row.Bestelling_door_financ_dienst_geplaatst,
      cell: (row: Row) => (
        <div title={row.Bestelling_door_financ_dienst_geplaatst}>
          {row.Bestelling_door_financ_dienst_geplaatst}
        </div>
      ),
    },
    {
      name: "Bestelling verzonden (verwachte aankomst)",
      selector: (row: Row) => row.Bestelling_verzonden_verwachtte_aankomst,
      cell: (row: Row) => (
        <div title={row.Bestelling_verzonden_verwachtte_aankomst}>
          {row.Bestelling_verzonden_verwachtte_aankomst}
        </div>
      ),
    },
    {
      name: "Bestelling ontvangen datum",
      selector: (row: Row) => row.Bestelling_ontvangen_datum,
      cell: (row: Row) => (
        <div title={row.Bestelling_ontvangen_datum}>
          {row.Bestelling_ontvangen_datum}
        </div>
      ),
    },
    {
      name: "Opmerkingen",
      selector: (row: Row) => row.Opmerkingen,
      cell: (row: Row) => <div title={row.Opmerkingen}>{row.Opmerkingen}</div>,
    },
    {
      name: "Totaalprijs project",
      selector: (row: Row) => row.Totaalprijs_project,
      cell: (row: Row) => (
        <div title={row.Totaalprijs_project.toString()}>
          {row.Totaalprijs_project}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container my-5">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            fixedHeader
            pagination
            subHeader
            subHeaderComponent={
              <div className="d-flex justify-content-between">
                <div>
                  <h4>Project ID: {selectedProjectId}</h4>
                </div>
              </div>
            }
          />
        )}
      </div>
    </>
  );
}

export default Table;
