/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { createChart } from "../Utils/app.utils";
import { Chart, ChartOptions, ChartType, DefaultDataPoint } from "chart.js";

const CustomChart = ({
  id,
  width = "400",
  height = "200",
  options,
  setCanvasChart,
}: {
  id: string;
  width?: string;
  height?: string;
  options: ChartOptions;
  setCanvasChart: (
    Chart: Chart<ChartType, DefaultDataPoint<ChartType>, unknown> | null
  ) => void;
}) => {
  useEffect(() => {
    setCanvasChart(createChart(id, options));
  }, []);

  return <canvas id={id} width={width} height={height}></canvas>;
};

export default React.memo(CustomChart);
