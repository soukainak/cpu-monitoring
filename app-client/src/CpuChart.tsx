import { useEffect, useState } from "react";
import CustomChart from "./Components/CustomChart";
import { Chart } from "chart.js";

const CPUChart = ({data}: {data: number[]}) => {

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const [canvasChart, setCanvasChart] = useState<Chart<any, any, any> | null>()


    useEffect(() => {
        if (canvasChart) {
            console.log(data);
            canvasChart.data.datasets[0].data = data;
            canvasChart.update();
        }
    }, [data])

    return (
        <CustomChart id="myChart" options={options} setCanvasChart={setCanvasChart}></CustomChart>
    )

}

export default CPUChart;