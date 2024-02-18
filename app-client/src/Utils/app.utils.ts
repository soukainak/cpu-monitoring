import { Chart } from "chart.js";
import { retrieveCPULoadData } from "../Services/app.service";

const generateTimeIntervals = (observationWindow: number): string[] => {
  const intervals: string[] = [];
  const intervalInSeconds = 10;
  const totalIntervals = (60 * observationWindow) / intervalInSeconds; // 10 minutes in seconds divided by intervalInSeconds

  // Get the current time in milliseconds
  const currentTime = Date.now();

  // Generate the array of time intervals
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

    const isHighCPU = !checkHighCpuRange.some((e) => e < 0.45);
    const hasCPURecovered = !checkHighCpuRange.some((e) => e >= 0.45);

    const storedCPUHighMoment = localStorage.getItem("cpuHighMoment");
    const storedCPUHighOccurences = localStorage.getItem("cpuHighOccurences");
    const storedCpuRecoveredOccurences = localStorage.getItem(
      "cpuRecoveredOccurences"
    );

    if (isHighCPU) {
      localStorage.setItem(
        "cpuHighOccurences",
        storedCPUHighOccurences
          ? (parseInt(storedCPUHighOccurences) + 1).toString()
          : "1"
      );
      if (!storedCPUHighMoment || storedCPUHighMoment === "") {
        localStorage.setItem("cpuRecoveredMoment", "");
        localStorage.setItem("cpuRecoveredOccurences", "");
        localStorage.setItem("cpuHighMoment", Date.now().toString());
      }
    } else if (hasCPURecovered && storedCPUHighMoment) {
      localStorage.setItem(
        "cpuRecoveredOccurences",
        storedCpuRecoveredOccurences
          ? (parseInt(storedCpuRecoveredOccurences) + 1).toString()
          : "1"
      );
      localStorage.setItem("cpuHighMoment", "");
      localStorage.setItem("cpuHighOccurences", "");
      localStorage.setItem("cpuRecoveredMoment", Date.now().toString());
    }
  }
};

const createChart = (
  elementId: string,
  options: any,
  observationWindow: number
): Chart<any, any, any> | null => {
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
            data: Array(60).fill(0.45, 0, 60),
            type: "line",
            order: 1,
          },
        ],
        labels: [...generateTimeIntervals(observationWindow)],
      },
      options: options,
    })
  );
};

const fetchCPULoadData = async (
  setAverageLoad: (cpuData: {
    cpusLength: number;
    loadAverage: number;
  }) => void,
  cpuAverageLoadData: number[],
  updateData: (data: any) => void
): Promise<void> => {
  try {
    const response = await retrieveCPULoadData();
    if (cpuAverageLoadData.length >= 60) {
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
  fetchCPULoadData,
  generateTimeIntervals,
  createChart,
};
