import { FC, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "../card/card";
import { H3 } from "../typography/h3";
import { Spacing } from "../spacing/spacing";
import { CardCenteredElement } from "../card/cardCenteredElement";
import { H6 } from "../typography/h6";
import { P } from "../typography/p";
import { Image } from "../image/image";
import { ILinkedList } from "../../utils/linkedList";

interface Props {
    visualisationId: string
    name: string
    type: string
    timestamps: ILinkedList<number>
    data: ILinkedList<number>
}

export const Visualisation: FC<Props> = ({ visualisationId, name, type, timestamps, data }) => {
    const mappedTimestamps = useMemo(() => [...timestamps.values()].map(entry => new Date(entry).toLocaleString()), [timestamps])
    const mappedData = useMemo(() => [...data.values()], [data])

    const options = useMemo<ReactApexChart['props']['options']>(() => ({
        chart: {
            id: visualisationId
        },
        xaxis: {
            categories: mappedTimestamps,
            tickAmount: 1,
            labels: {
                rotate: 0
            }
        }
    }), [mappedTimestamps, visualisationId])

    const series = useMemo<ReactApexChart['props']['series']>(() => [
        {
            name,
            data: mappedData
        }
    ], [mappedData, name])

    return (
        !mappedData?.length
            ? <Image id="wind" size="xl" scaleFactor={5} />
            : <ReactApexChart
                type={(type as ReactApexChart['props']['type']) || 'area'}
                options={options}
                series={series}
                height={384}
                width={'150%'}
            />
    )
}
