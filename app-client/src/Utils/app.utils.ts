import { Chart, ChartOptions, ChartType, DefaultDataPoint } from "chart.js";
import { retrieveCPULoadData } from "../Services/app.service";

const threshold = 1;
const intervalInSeconds = 10;

const generateTimeIntervals = (
  observationWindowInMinutes: number
): string[] => {
  const intervals: string[] = [];
  const totalIntervals = (60 * observationWindowInMinutes) / intervalInSeconds;

  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Generate an array of time intervals in ten last minutes
  for (let i = totalIntervals - 1; i >= 0; i--) {
    const time = new Date(currentTime - i * intervalInSeconds * 1000);
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    const hours = String(time.getHours()).padStart(2, "0");
    intervals.push(`${hours}:${minutes}:${seconds}`);
  }

  return intervals;
};

const handleCPULevelAlert = (newAverageOverTime: number[]) => {
  if (newAverageOverTime.length >= 12) {
    let checkHighCpuRange = newAverageOverTime.slice(-12);
    const isHighCPU = !checkHighCpuRange.some((e) => e < threshold);
    const hasCPURecovered = !checkHighCpuRange.some((e) => e >= threshold);

    const storedCPUHighMoment = localStorage.getItem("cpuHighMoment");
    const storedCPUHighOccurences = localStorage.getItem("cpuHighOccurences");
    const storedCpuRecoveredOccurences = localStorage.getItem(
      "cpuRecoveredOccurences"
    );

    if (isHighCPU && (!storedCPUHighMoment || storedCPUHighMoment === "")) {
      localStorage.setItem("cpuRecoveredMoment", "");
      localStorage.setItem("cpuHighMoment", Date.now().toString());
      localStorage.setItem(
        "cpuHighOccurences",
        storedCPUHighOccurences
          ? (parseInt(storedCPUHighOccurences) + 1).toString()
          : "1"
      );
    } else if (hasCPURecovered && storedCPUHighMoment) {
      localStorage.setItem("cpuHighMoment", "");
      localStorage.setItem(
        "cpuRecoveredOccurences",
        storedCpuRecoveredOccurences
          ? (parseInt(storedCpuRecoveredOccurences) + 1).toString()
          : "1"
      );
      localStorage.setItem("cpuRecoveredMoment", Date.now().toString());
    }
  }
};

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

const handleCPULoadData = async (
  setAverageLoad: (cpuData: {
    cpusLength: number;
    loadAverage: number;
  }) => void,
  cpuAverageLoadData: number[],
  updateData: (data: number) => void
): Promise<void> => {
  try {
    const nbIntervalsInTenMinutes = 60;
    const response = await retrieveCPULoadData();
    if (cpuAverageLoadData.length >= nbIntervalsInTenMinutes) {
      cpuAverageLoadData.shift();
    }
    updateData(response?.data.loadAverage);
    setAverageLoad(response?.data);
    handleCPULevelAlert(cpuAverageLoadData);
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
