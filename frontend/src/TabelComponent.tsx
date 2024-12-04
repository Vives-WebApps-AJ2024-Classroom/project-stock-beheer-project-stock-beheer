import React from "react";
import { financialData } from "./data";

const TabelComponent: React.FC = () => {
  const columns = [
    { key: "year", label: "Jaar" },
    { key: "profit", label: "Winst (€Miljoen)" },
    { key: "expenses", label: "Uitgaven (€Miljoen)" },
    { key: "revenue", label: " totale winst (€Miljoen)" }
  ];

  return (
    <div style={{ overflowX: "auto", padding: "20px" }}>
      <table style={{ width: "75%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                  textAlign: "left"
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {financialData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px"
                  }}
                >
                  {row[column.key as keyof typeof row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelComponent;
