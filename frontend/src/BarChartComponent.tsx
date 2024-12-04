import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer
} from "recharts";
import { financialData } from "./data";

const ProfitComposedChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={financialData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="profit" barSize={40} fill="#4caf50" />
        <Bar dataKey="expenses" barSize={40} fill="#f44336" />
        <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ProfitComposedChart;
