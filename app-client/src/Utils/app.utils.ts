import { Chart, ChartOptions, ChartType, DefaultDataPoint } from "chart.js";
import { retrieveCPULoadData } from "../Services/app.service";

const threshold = 1;
const intervalInSeconds = 10;

// Generate an array of time intervals in n last minutes
const generateTimeIntervals = (
  observationWindowInMinutes: number
): string[] => {
  const intervals: string[] = [];
  const totalIntervals = (60 * observationWindowInMinutes) / intervalInSeconds;

  // Get the current time in milliseconds
  const currentTime = Date.now();

  for (let i = totalIntervals - 1; i >= 0; i--) {
    const time = new Date(currentTime - i * intervalInSeconds * 1000);
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const hours = String(time.getHours()).padStart(2, "0");
    intervals.push(`${hours}:${minutes}:${seconds}`);
  }

  return intervals;
};

//Update localStorage to handle alerting moments and occurences for heavy and recorver status
const handleCPULevelAlert = (
  newAverageOverTime: number[],
  setData: (key: string, value: string) => void,
  getData: (key: string) => string
) => {
  if (newAverageOverTime.length >= 12) {
    let checkHighCpuRange = newAverageOverTime.slice(-12);
    const isHighCPU = !checkHighCpuRange.some((e) => e < threshold);
    const hasCPURecovered = !checkHighCpuRange.some((e) => e >= threshold);
    const storedCPUHighMoment = getData("cpuHighMoment");
    const storedCPUHighOccurences = getData("cpuHighOccurences");
    const storedCpuRecoveredOccurences = getData("cpuRecoveredOccurences");

    // Setup an high CPU alert when CPU load average is heavy for the first time or after recovery in the if
    // Setup a recovery alert when CPU load average is under threshold for 2 minutes and the CPU load average was under heavy alert right before
    if (isHighCPU && (!storedCPUHighMoment || storedCPUHighMoment === "")) {
      setData("cpuRecoveredMoment", "");
      setData("cpuHighMoment", Date.now().toString());
      setData(
        "cpuHighOccurences",
        storedCPUHighOccurences
          ? (parseInt(storedCPUHighOccurences) + 1).toString()
          : "1"
      );
    } else if (hasCPURecovered && storedCPUHighMoment) {
      setData("cpuHighMoment", "");
      setData(
        "cpuRecoveredOccurences",
        storedCpuRecoveredOccurences
          ? (parseInt(storedCpuRecoveredOccurences) + 1).toString()
          : "1"
      );
      setData("cpuRecoveredMoment", Date.now().toString());
    }
  }
};

// Get canvas with given id and use it as context to create a new chart with bars and line data vizualisation
const createChart = (
  elementId: string,
  options: ChartOptions
): Chart<ChartType, DefaultDataPoint<ChartType>, unknown> | null => {
  const cpuLoadChartCanvas = document.getElementById(
    elementId
  ) as HTMLCanvasElement | null;

  const cpuLoadChartContext =
    cpuLoadChartCanvas && cpuLoadChartCanvas.getContext("2d");

  return (
    cpuLoadChartContext &&
    new Chart(cpuLoadChartContext, {
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
            data: Array(60).fill(threshold, 0, 60),
            type: "line",
            order: 1,
          },
        ],
        labels: [],
      },
      options: options,
    })
  );
};

//Fetch api to retrive data each 10 seconds and call functions to display data and handle alerts
const handleCPULoadData = async (
  setAverageLoad: (cpuData: {
    cpusLength: number;
    loadAverage: number;
  }) => void,
  cpuAverageLoadData: number[],
  updateData: (data: number) => void,
  setData: (key: string, value: string) => void,
  getData: (key: string) => string
): Promise<void> => {
  try {
    const nbIntervalsInTenMinutes = 60;
    const response = await retrieveCPULoadData();
    if (cpuAverageLoadData.length >= nbIntervalsInTenMinutes) {
      cpuAverageLoadData.shift();
    }
    updateData(response?.data.loadAverage);
    setAverageLoad(response?.data);
    handleCPULevelAlert(cpuAverageLoadData, setData, getData);
  } catch (error) {
    console.error("something went wrong while retrieving CPU data", error);
  }
};

export {
  handleCPULevelAlert,
  handleCPULoadData,
  generateTimeIntervals,
  createChart,
};
