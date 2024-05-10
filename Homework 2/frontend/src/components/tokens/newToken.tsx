import { FC } from "react"
import { Card } from "../card/card"
import { Button } from "../input/button"
import { Spacing } from "../spacing/spacing"
import { H1 } from "../typography/h1"
import { Image } from "../image/image"

interface Props {
    onGoToCreateProjectToken(): void
}

export const NewToken: FC<Props> = ({ onGoToCreateProjectToken }) => {
    return (
        <Card width={384} noBorder noShadow centered>
            <H1>Nothing found...</H1>
            <Image id="key" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <Button onClick={onGoToCreateProjectToken}>Create a token</Button>
        </Card>
    )
}
