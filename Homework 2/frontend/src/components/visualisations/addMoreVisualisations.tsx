import { FC } from "react";
import { Card } from "../card/card";
import { Button } from "../input/button";
import { H3 } from "../typography/h3";
import { Image } from "../image/image";
import { Spacing } from "../spacing/spacing";
import { CardSpaceElement } from "../card/cardSpaceElement";

interface Props {
    onGoToCreateVisualisation(): void
}

export const AddMoreVisualisations: FC<Props> = ({ onGoToCreateVisualisation }) => {
    return (
        <Card width={'42vw'} centered noShadow>
            <H3>Need more?</H3>
            <CardSpaceElement />
            <Image id="chart" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <CardSpaceElement />
            <Button onClick={onGoToCreateVisualisation}>Add more</Button>
        </Card>
    )
}
