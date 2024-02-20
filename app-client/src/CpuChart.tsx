import { useEffect, useState } from "react";
import CustomChart from "./Components/CustomChart";
import { Chart, ChartType, DefaultDataPoint } from "chart.js";
import { Alert, AlertColor } from "@mui/material";
import { generateTimeIntervals } from "./Utils/app.utils";
import "./CpuChart.css";

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
  const [canvasChart, setCanvasChart] = useState<Chart<
    ChartType,
    DefaultDataPoint<ChartType>,
    unknown
  > | null>();
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
      const labels = generateTimeIntervals(10);
      canvasChart.data.labels = labels;
      canvasChart.update();
    }
  }, [data, canvasChart]);

  const displayAlert = (
    displayAlert: boolean,
    color: AlertColor,
    descriptionText: string,
    occurences: string | null,
    moment: string | null
  ) => {
    return (
      displayAlert && (
        <Alert color={color}>
          {descriptionText}
          {new Date(parseInt(moment || "")).toLocaleString() +
            ". It occured " +
            occurences +
            " times"}
        </Alert>
      )
    );
  };

  return (
    <div className="wrapper">
      {displayAlert(
        isHighCPUAlertDisplayed,
        "error",
        "My computer is under heavy CPU load from ",
        storedCPUHighOccurences,
        localCPUHighMoment
      )}
      {displayAlert(
        isRecoveredCPUAlertDisplayed,
        "success",
        "My computer recovered from heavy CPU load from ",
        storedCpuRecoveredOccurences,
        localCPURecoveredMoment
      )}
      <CustomChart
        id="myChart"
        options={options}
        setCanvasChart={setCanvasChart}
      />
    </div>
  );
};

export default CPUChart;
