import React, { useEffect } from "react";
import { createChart } from "../Utils/app.utils";

const CustomChart = ({
  id,
  width = "400",
  height = "200",
  options,
  observationWindow,
  setCanvasChart,
}: {
  id: string;
  width?: string;
  height?: string;
  options: any;
  observationWindow: number;
  setCanvasChart: any;
}) => {
  useEffect(() => {
    setCanvasChart(createChart(id, options, observationWindow));
  }, []);

  return <canvas id={id} width={width} height={height}></canvas>;
};

export default React.memo(CustomChart);
