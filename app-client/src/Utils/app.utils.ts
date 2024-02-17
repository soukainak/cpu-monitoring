import { Chart } from "chart.js";
import { retrieveCPULoadData } from "../Services/app.service";

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

    const isHighCPU = !checkHighCpuRange.some((e) => e < 0.45);

    const hasCPURecovered =
      !checkHighCpuRange.some((e) => e >= 0.45);

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

const createChart = (elementId: string, options: any): Chart<any, any, any> | null => {
  const cpuLoadChartCanvas = document.getElementById(elementId) as HTMLCanvasElement | null;

  const cpuLoadChartContext =
    cpuLoadChartCanvas && cpuLoadChartCanvas.getContext("2d");

  return (cpuLoadChartContext && new Chart(cpuLoadChartContext, {
    type: "bar",
    data: {
      datasets: [
        {
          label: "CPU Average load",
          data: [],
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
  }))
}

const fetchCPULoadData = async (
  setIsHighCpuAlert: alertSetter,
  setIsRecoveryAlert: alertSetter,
  setAverageLoad: (cpuData: { cpusLength: number; loadAverage: number }) => void,
  setCpuAverageLoadData: (cpuData: number[]) => void,
  cpuAverageLoadData: number[] 
  ): Promise<void> => {
  try {
    const response = await retrieveCPULoadData();
    if (cpuAverageLoadData.length >= 60) {
      cpuAverageLoadData.shift();
    }
    console.log("Into fetchLoad");
    console.log(cpuAverageLoadData);
    setCpuAverageLoadData([...cpuAverageLoadData, response?.data.loadAverage])

    setAverageLoad(response?.data);

    handleCPULevelAlert(
      setIsHighCpuAlert,
      setIsRecoveryAlert,
      cpuAverageLoadData
    );
  } catch (error) {
    console.error("something went wrong while retrieving CPU data", error);
  }
};

export {
  handleCPULevelAlert,
  fetchCPULoadData,
  generateTimeIntervals,
  createChart
};
