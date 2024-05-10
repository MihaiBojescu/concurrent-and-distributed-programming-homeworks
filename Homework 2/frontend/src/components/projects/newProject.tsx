import { FC } from "react"
import { Card } from "../card/card"
import { Button } from "../input/button"
import { Spacing } from "../spacing/spacing"
import { H1 } from "../typography/h1"
import { Image } from "../image/image"

interface Props {
    onGoToCreateProject(): void
}

export const NewProject: FC<Props> = ({ onGoToCreateProject }) => {
    return (
        <Card width={384} noBorder noShadow centered>
            <H1>Nothing found...</H1>
            <Image id="newProject" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <Button onClick={onGoToCreateProject}>Create a project</Button>
        </Card>
    )
}