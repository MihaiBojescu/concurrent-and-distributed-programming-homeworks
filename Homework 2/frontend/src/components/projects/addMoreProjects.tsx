import { FC } from "react";
import { Card } from "../card/card";
import { CardSpaceElement } from "../card/cardSpaceElement";
import { Button } from "../input/button";
import { Spacing } from "../spacing/spacing";
import { H3 } from "../typography/h3";
import { Image } from "../image/image";

interface Props {
    onGoToCreateProject(): void
}

export const AddMoreProjects: FC<Props> = ({ onGoToCreateProject }) => {
    return (
        <Card width={384} centered noShadow>
            <H3>Need more?</H3>
            <CardSpaceElement />
            <Image id="newProject" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <CardSpaceElement />
            <Button onClick={onGoToCreateProject}>Add more</Button>
        </Card>
    )
}