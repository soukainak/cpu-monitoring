import { useEffect, useState } from "react";
import CustomChart from "./Components/CustomChart";
import { Chart } from "chart.js";
import { Alert } from "@mui/material";

const CPUChart = ({ data }: { data: number[] }) => {
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        display: false,
      },
    },
  };
  const storedCpuRecoveredOccurences = localStorage.getItem(
    "cpuRecoveredOccurences"
  );
  const storedCPUHighOccurences = localStorage.getItem("cpuHighOccurences");
  const [canvasChart, setCanvasChart] = useState<Chart<any, any, any> | null>();
  const [isHighCPUAlertDisplayed, setIsHighCPUAlertDisplayed] =
    useState<boolean>(false);
  const [isRecoveredCPUAlertDisplayed, setIsRecoveredCPUAlertDisplayed] =
    useState<boolean>(false);

  const localCPUHighMoment = localStorage.getItem("cpuHighMoment");
  const localCPURecoveredMoment = localStorage.getItem("cpuRecoveredMoment");
  useEffect(() => {
    if (localCPUHighMoment && localCPUHighMoment !== "") {
      setIsHighCPUAlertDisplayed(true);
    } else {
      setIsHighCPUAlertDisplayed(false);
    }
  }, [localCPUHighMoment]);

  useEffect(() => {
    if (localCPURecoveredMoment && localCPURecoveredMoment !== "") {
      setIsRecoveredCPUAlertDisplayed(true);
    } else {
      setIsRecoveredCPUAlertDisplayed(false);
    }
  }, [localCPURecoveredMoment]);

  useEffect(() => {
    if (canvasChart) {
      canvasChart.data.datasets[0].data = data;
      canvasChart.update();
    }
  }, [data]);

  return (
    <div style={{ width: "800px" }}>
      {isHighCPUAlertDisplayed && (
        <Alert color="error">
          CPU went higher than threshold at{" "}
          {new Date(parseInt(localCPUHighMoment || "")).toLocaleString() +
            ". It Occured " +
            storedCPUHighOccurences +
            " times"}
        </Alert>
      )}
      {isRecoveredCPUAlertDisplayed && (
        <Alert color="success">
          CPU has recovered at{" "}
          {new Date(parseInt(localCPURecoveredMoment || "")).toLocaleString() +
            ". It Occured " +
            storedCpuRecoveredOccurences +
            " times"}
        </Alert>
      )}
      <CustomChart
        id="myChart"
        options={options}
        setCanvasChart={setCanvasChart}
        observationWindow={10}
      ></CustomChart>
    </div>
  );
};

export default CPUChart;
