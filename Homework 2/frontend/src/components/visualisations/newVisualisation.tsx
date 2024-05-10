import { FC } from "react"
import { Card } from "../card/card"
import { Image } from "../image/image"
import { Button } from "../input/button"
import { Spacing } from "../spacing/spacing"
import { H1 } from "../typography/h1"

interface Props {
    onGoToCreateVisualisation(): void
}

export const NewVisualisation: FC<Props> = ({ onGoToCreateVisualisation }) => {
    return (
        <Card width={384} noBorder noShadow centered>
            <H1>Nothing found...</H1>
            <Image id="chart" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <Button onClick={onGoToCreateVisualisation}>Create a visualisation</Button>
        </Card>
    )
}