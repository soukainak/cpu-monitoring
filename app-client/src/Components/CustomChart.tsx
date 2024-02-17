import { Chart } from "chart.js";
import React, { useEffect, useState } from "react";
import { createChart } from "../Utils/app.utils";

const CustomChart = ({ id, width = "400", height = "200", options, setCanvasChart }: { id: string, width?: string, height?: string, options: any, setCanvasChart: any
 }) => {

    useEffect(() => {
        setCanvasChart(createChart(id, options))
    }, [])

    return (<canvas id={id} width={width} height={height}></canvas>)
}

export default React.memo(CustomChart);
