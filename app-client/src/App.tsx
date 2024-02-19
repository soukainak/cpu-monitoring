import React, { FunctionComponent, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { fetchCPULoadData } from "./Utils/app.utils";
import CPUChart from "./CpuChart";
import "./App.css";

Chart.register(...registerables);

interface CpuData {
  cpusLength: number;
  loadAverage: number;
}

const App: FunctionComponent = () => {
  const [averageLoad, setAverageLoad] = useState<CpuData>({
    cpusLength: 0,
    loadAverage: 0,
  });
  const [cpuAverageLoadData, setCpuAverageLoadData] = useState<number[]>(
    localStorage
      .getItem("cpuLoadData")
      ?.split(",")
      .map((x) => parseFloat(x)) || []
  );

  const updateData = (data: any) => {
    const newData = cpuAverageLoadData;
    newData.push(data);
    setCpuAverageLoadData([...newData]);
    localStorage.setItem("cpuLoadData", newData.toString());
  };

  useEffect(() => {
    fetchCPULoadDataOnIntervals();
  }, []);

  const fetchCPULoadDataOnIntervals = () => {
    setInterval(
      () =>
        fetchCPULoadData(setAverageLoad, cpuAverageLoadData || [], updateData),
      10000
    );
  };

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>the average CPU load change over last 10 minutes</h3>
      <p>Number of CPU cores on my computer : {averageLoad.cpusLength}</p>
      <p>Current average CPU load : {averageLoad.loadAverage}</p>
      <CPUChart data={cpuAverageLoadData} />
    </div>
  );
};

export default App;
