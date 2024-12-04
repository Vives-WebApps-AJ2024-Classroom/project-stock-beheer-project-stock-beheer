import DataTable from "react-data-table-component";
import "../Layout/Table.css";

interface Row {
  id: number;
  Jaar: number;
  Winst: number;
  Verlies: number;
}

function Table() {
  const rows: Row[] = [
    { id: 1, Jaar: 2015, Winst: 4000, Verlies: 1500 },
    { id: 2, Jaar: 2016, Winst: 5000, Verlies: 2000 },
    { id: 3, Jaar: 2017, Winst: 7000, Verlies: 3000 },
    { id: 4, Jaar: 2018, Winst: 8000, Verlies: 4000 },
    { id: 5, Jaar: 2019, Winst: 6000, Verlies: 2500 },
    { id: 6, Jaar: 2020, Winst: 9000, Verlies: 3500 },
    { id: 7, Jaar: 2021, Winst: 10000, Verlies: 4500 },
    { id: 8, Jaar: 2022, Winst: 11000, Verlies: 5000 },
    { id: 9, Jaar: 2023, Winst: 12000, Verlies: 5500 },
    { id: 10, Jaar: 2024, Winst: 13000, Verlies: 6000 }
  ];

  const columns = [
    {
      name: "Jaar",
      selector: (row: Row) => row.Jaar
    },
    {
      name: "Winst",
      selector: (row: Row) => row.Winst
    },
    {
      name: "Verlies",
      selector: (row: Row) => row.Verlies
    }
  ];

  return (
    <>
      <div className="container my-5">
        <DataTable
          columns={columns}
          data={rows}
          fixedHeader
        />
      </div>
    </>
  );
}

export default Table;
