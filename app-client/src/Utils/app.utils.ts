import { Chart } from "chart.js";
import { retrieveCPULoadData } from "../Services/app.service";

let newAverageOverTime: number[] = [];
let cpuLoadAverageChart: any;

const generateTimeIntervals = (): string[] => {
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
};

const handleCPULevelAlert = (
  setIsHighCpuAlert: alertSetter,
  setIsRecoveryAlert: alertSetter,
  newAverageOverTime: number[]
) => {
  if (newAverageOverTime.length >= 12) {
    let checkHighCpuRange = newAverageOverTime.slice(-12);

    const isHighCPU = checkHighCpuRange.filter((e) => e < 0.45).length === 0;
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
};

type alertSetter = (alertStatus: boolean) => void;

const handleCPULoadChart = async (
  newAverageOverTime: number[],
  cpuLoadAverageChart: any,
  createNewChart: (newChart: any) => void
) => {
  if (newAverageOverTime.length > 60) {
    newAverageOverTime.shift();
  }
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const cpuLoadChartCanvas: any = document.getElementById("myChart");
  const cpuLoadChartContext =
    cpuLoadChartCanvas && cpuLoadChartCanvas.getContext("2d");

  if (cpuLoadAverageChart) {
    cpuLoadAverageChart.data.datasets[0].data = newAverageOverTime;
    cpuLoadAverageChart.update();
  } else {
    cpuLoadAverageChart = createNewChart(
      new Chart(cpuLoadChartContext, {
        type: "bar",
        data: {
          datasets: [
            {
              label: "CPU Average load",
              data: [...newAverageOverTime],
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
      })
    );
  }
};

const createNewChart = (newChart: any) => {
  cpuLoadAverageChart = newChart;
};

const fetchCPULoadData = async (
  setIsHighCpuAlert: alertSetter,
  setIsRecoveryAlert: alertSetter,
  setAverageLoad: (cpuData: { cpusLength: number; loadAverage: number }) => void
): Promise<void> => {
  try {
    const response = await retrieveCPULoadData();
    newAverageOverTime.push(response?.data.loadAverage);

    setAverageLoad(response?.data);
    handleCPULevelAlert(
      setIsHighCpuAlert,
      setIsRecoveryAlert,
      newAverageOverTime
    );
    handleCPULoadChart(newAverageOverTime, cpuLoadAverageChart, createNewChart);
  } catch (error) {
    console.error("something went wrong while retrieving CPU data", error);
  }
};

export {
  handleCPULoadChart,
  handleCPULevelAlert,
  fetchCPULoadData,
  generateTimeIntervals,
};
