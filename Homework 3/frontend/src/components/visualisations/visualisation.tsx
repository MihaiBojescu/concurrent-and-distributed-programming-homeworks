import { FC, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Image } from "../image/image";

interface Props {
    visualisationId: string
    name: string
    type: string
    timestamps: string[]
    data: number[]
}

export const Visualisation: FC<Props> = ({ visualisationId, name, type, timestamps, data }) => {
    const options = useMemo<ReactApexChart['props']['options']>(() => ({
        chart: {
            id: visualisationId
        },
        xaxis: {
            categories: timestamps,
            tickAmount: 1,
            labels: {
                rotate: 0
            }
        }
    }), [timestamps, visualisationId])

    const series = useMemo<ReactApexChart['props']['series']>(() => [
        {
            name,
            data
        }
    ], [data, name])

    return (
        !data?.length
            ? <Image id="wind" size="xl" scaleFactor={5} />
            : <ReactApexChart
                type={(type as ReactApexChart['props']['type']) || 'area'}
                options={options}
                series={series}
                height={384}
                width={'100%'}
            />
    )
}
