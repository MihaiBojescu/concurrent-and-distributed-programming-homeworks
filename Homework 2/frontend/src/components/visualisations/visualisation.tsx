import { FC, useMemo } from "react";
import { Data } from "../../reducer/data/types";
import ReactApexChart from "react-apexcharts";
import { Card } from "../card/card";
import { H3 } from "../typography/h3";
import { Spacing } from "../spacing/spacing";
import { CardCenteredElement } from "../card/cardCenteredElement";
import { H6 } from "../typography/h6";
import { P } from "../typography/p";
import { Image } from "../image/image";

interface Props {
    visualisationId: string
    name: string
    description: string
    type: string
    data: Data[]
}

export const Visualisation: FC<Props> = ({ visualisationId, name, description, type, data }) => {
    const options = useMemo<ReactApexChart['props']['options']>(() => {
        const timestamps = data.map(entry => new Date(entry.timestamp).toLocaleString())

        return {
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
        }
    }, [data, visualisationId])

    const series = useMemo<ReactApexChart['props']['series']>(() => {
        const series = data.map(entry => Number(entry.value))

        return [
            {
                name,
                data: series
            }
        ]
    }, [data, name])

    return (
        <Card width={'42vw'}>
            <H3>{name}</H3>
            <CardCenteredElement>
                {
                    !data?.length
                        ? <Image id="wind" size="xl" scaleFactor={5} />
                        : <ReactApexChart
                            type={(type as ReactApexChart['props']['type']) || 'area'}
                            options={options}
                            series={series}
                            height={384}
                            width={'150%'}
                        />
                }
            </CardCenteredElement>
            <Spacing spacing="m" />
            <H6>Visualisation id:</H6>
            <P>{visualisationId}</P>
            {description && (
                <>
                    <H6>Description:</H6>
                    <P>{description}</P>
                </>
            )}
        </Card>
    )
}