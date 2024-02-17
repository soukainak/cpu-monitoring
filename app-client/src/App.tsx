import React, { FunctionComponent, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import "./App.css";
import { fetchCPULoadData } from "./Utils/app.utils";
import CustomChart from "./Components/CustomChart";
import CPUChart from "./CpuChart";
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
  const [isHighCpuAlert, setIsHighCpuAlert] = useState<boolean>(false);
  const [isRecoveryAlert, setIsRecoveryAlert] = useState<boolean>(false);
  const [cpuAverageLoadData, SetCpuAverageLoadData] = useState<number[]>([]);


  useEffect(() => {
    fetchCPULoadDataOnIntervals();
  }, []);

  useEffect(() => {
    if (isHighCpuAlert) alert("HIGH CPU ALERT");
  }, [isHighCpuAlert]);

  useEffect(() => {
    if (isRecoveryAlert) alert("CPU has recovered");
  }, [isRecoveryAlert]);

  const fetchCPULoadDataOnIntervals = () => {
    setInterval(
      () =>
        fetchCPULoadData(setIsHighCpuAlert, setIsRecoveryAlert, setAverageLoad, SetCpuAverageLoadData, cpuAverageLoadData),
      5000
    );
  };

  return (
    <div className="App">
      <h3>the average CPU load change over last 10 minutes</h3>
      <p>Number of CPUs on my computer : {averageLoad.cpusLength}</p>
      <p>Current average cpu load : {averageLoad.loadAverage}</p>
      <CPUChart data={cpuAverageLoadData}/>
    </div>
  );
};

export default App;
