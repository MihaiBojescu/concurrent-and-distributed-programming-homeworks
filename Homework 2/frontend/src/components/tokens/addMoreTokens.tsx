import { FC } from "react";
import { Card } from "../card/card";
import { CardSpaceElement } from "../card/cardSpaceElement";
import { Button } from "../input/button";
import { Spacing } from "../spacing/spacing";
import { H3 } from "../typography/h3";
import { Image } from "../image/image";

interface Props {
    onGoToCreateProjectToken(): void
}

export const AddMoreTokens: FC<Props> = ({ onGoToCreateProjectToken }) => {
    return (
        <Card width={384} centered noShadow>
            <H3>Need more?</H3>
            <CardSpaceElement />
            <Image id="key" size="xl" scaleFactor={5} />
            <Spacing spacing="m" />
            <CardSpaceElement />
            <Button onClick={onGoToCreateProjectToken}>Add more</Button>
        </Card>
    )
}