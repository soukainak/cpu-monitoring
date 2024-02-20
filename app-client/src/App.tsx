import React, { FunctionComponent, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { handleCPULoadData } from "./Utils/app.utils";
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

  const updateData = (data: number) => {
    const newData = cpuAverageLoadData;
    newData.push(data);
    setCpuAverageLoadData([...newData]);
    localStorage.setItem("cpuLoadData", newData.toString());
  };

  const handleCPULoadDataOnIntervals = () => {
    setInterval(
      () =>
        handleCPULoadData(setAverageLoad, cpuAverageLoadData || [], updateData),
      10000
    );
  };

  useEffect(() => {
    handleCPULoadDataOnIntervals();
  }, []);

  return (
    <div className="App">
      <h3>The average CPU load change over last 10 minutes</h3>
      <p>Number of CPU cores on my computer : {averageLoad.cpusLength}</p>
      <p>Current average CPU load : {averageLoad.loadAverage}</p>
      <CPUChart data={cpuAverageLoadData} />
    </div>
  );
};

export default App;
