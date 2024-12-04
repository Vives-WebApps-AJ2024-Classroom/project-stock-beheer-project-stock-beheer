import "./App.css";
import BarChartComponent from "./BarChartComponent";
import TabelComponent from "./TabelComponent";

function App() {
  return (
    <div className="App">
      <h1>Bedrijfswinsten en Uitgaven per Jaar</h1>
      <div className="chart-and-table">
        <BarChartComponent />
        <TabelComponent />
      </div>
    </div>
  );
}

export default App;
