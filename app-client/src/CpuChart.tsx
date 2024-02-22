import { useEffect, useState } from "react";
import CustomChart from "./Components/CustomChart";
import { Chart, ChartType, DefaultDataPoint } from "chart.js";
import { Alert, AlertColor } from "@mui/material";
import { generateTimeIntervals } from "./Utils/app.utils";
import "./CpuChart.css";
import useLocalData from "./hooks/useLocalData";

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

  const { getData } = useLocalData();

  const [canvasChart, setCanvasChart] = useState<Chart<
    ChartType,
    DefaultDataPoint<ChartType>,
    unknown
  > | null>();
  const [isHighCPUAlertDisplayed, setIsHighCPUAlertDisplayed] =
    useState<boolean>(false);
  const [isRecoveredCPUAlertDisplayed, setIsRecoveredCPUAlertDisplayed] =
    useState<boolean>(false);

  useEffect(() => {
    if (getData("cpuHighMoment") && getData("cpuHighMoment") !== "") {
      setIsHighCPUAlertDisplayed(true);
    } else {
      setIsHighCPUAlertDisplayed(false);
    }
  }, [getData("cpuHighMoment")]);

  useEffect(() => {
    if (getData("cpuRecoveredMoment") && getData("cpuRecoveredMoment") !== "") {
      setIsRecoveredCPUAlertDisplayed(true);
    } else {
      setIsRecoveredCPUAlertDisplayed(false);
    }
  }, [getData("cpuRecoveredMoment")]);

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
        getData("cpuHighOccurences"),
        getData("cpuHighMoment")
      )}
      {displayAlert(
        isRecoveredCPUAlertDisplayed,
        "success",
        "My computer recovered from heavy CPU load from ",
        getData("cpuRecoveredOccurences"),
        getData("cpuRecoveredMoment")
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
