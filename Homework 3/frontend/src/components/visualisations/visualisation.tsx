import { FC } from "react";
import { Line } from "react-chartjs-2";
import { Image } from "../image/image";

interface Props {
    visualisationId: string
    name: string
    type: string
    timestamps: string[]
    data: number[]
}

export const Visualisation: FC<Props> = ({ visualisationId, name, type, timestamps, data }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: name,
            },
        },
    }
    const chartData = {
        labels: timestamps,
        datasets: [
            {
                fill: true,
                label: name,
                data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    return (
        !data?.length
            ? <Image id="wind" size="xl" scaleFactor={5} />
            : <Line options={options} data={chartData} />
    )
}
