import React, { FunctionComponent, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import "./App.css";
Chart.register(...registerables);

const App: FunctionComponent = () => {
  const [averageLoad, setAverageLoad] = useState<{
    cpus: any;
    cpusLength: number;
    loadAverage: number;
  }>({
    cpus: [],
    cpusLength: 0,
    loadAverage: 0,
  });
  const [isHighCpuAlert, setIsHighCpuAlert] = useState<boolean>(false);
  const [isRecoveryAlert, setIsRecoveryAlert] = useState<boolean>(false);

  let newAverageOverTime: number[] = [];
  let myChart: any;

  useEffect(() => {
    if (isHighCpuAlert) alert("HIGH CPU ALERT");
  }, [isHighCpuAlert]);
  useEffect(() => {
    if (isRecoveryAlert) alert("CPU has recovered");
  }, [isRecoveryAlert]);
  useEffect(() => {
    fetchData();
  }, []);

  function generateTimeIntervals() {
    const intervals = [];
    const secondsInMinute = 60;
    const intervalInSeconds = 10;
    const totalMinutes = 10;

    // Calculate the total number of intervals
    const totalIntervals = (totalMinutes * secondsInMinute) / intervalInSeconds;

    // Generate the array of time intervals
    for (let i = 0; i < totalIntervals; i++) {
      const minutes = Math.floor((i * intervalInSeconds) / secondsInMinute);
      const seconds = (i * intervalInSeconds) % secondsInMinute;
      const time = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      intervals.push(time);
    }

    return intervals;
  }
  const fetchData = () => {
    setInterval(async () => {
      try {
        const instance = axios.create({ baseURL: "http://localhost:8080" });
        const response = await instance.get("/api/data", {
          headers: {
            credentials: "include",
            mode: "same-origin",
            "content-type": "application/json",
            dataType: "json",
          },
        });
        if (newAverageOverTime.length > 60) {
          newAverageOverTime.shift();
        }
        if (newAverageOverTime.length >= 12) {
          let checkHighCpuRange = newAverageOverTime.slice(-12);

          const isHighCPU =
            checkHighCpuRange.filter((e) => e < 0.45).length === 0;

          const hasCPURecovered =
            checkHighCpuRange.filter((e) => e >= 0.45).length === 0;
          if (isHighCPU) {
            setIsHighCpuAlert(true);
            setIsRecoveryAlert(false);
          } else if (hasCPURecovered) {
            setIsRecoveryAlert(true);
            setIsHighCpuAlert(false);
          }
        }
        newAverageOverTime.push(response.data.loadAverage);
        setAverageLoad(response.data);
        const options = {
          scales: {
            y: {
              beginAtZero: true, // Axe Y commence à zéro
            },
          },
        };
        const chartSelector: any = document?.getElementById("myChart");
        const ctx = chartSelector && chartSelector.getContext("2d");

        if (myChart) {
          myChart.data.datasets[0].data = newAverageOverTime;
          myChart.update();
        } else {
          myChart = new Chart(ctx, {
            type: "bar",
            data: {
              datasets: [
                {
                  label: "CPU Average load",
                  data: newAverageOverTime,
                  order: 2,
                },
                {
                  label: "CPU Average limit",
                  data: Array(60).fill(0.45, 0, 60),
                  type: "line",
                  order: 1,
                },
              ],
              labels: [...generateTimeIntervals()],
            },
            options: options,
          });
        }
      } catch (e) {
        console.log("error", e);
      }
    }, 2000);
  };

  return (
    <div className="App">
      <h3>the average CPU load change over last 10 minutes</h3>
      <p>Number of CPUs on my computer : {averageLoad.cpusLength}</p>
      <p>Current average cpu load : {averageLoad.loadAverage}</p>
    </div>
  );
};

export default App;
