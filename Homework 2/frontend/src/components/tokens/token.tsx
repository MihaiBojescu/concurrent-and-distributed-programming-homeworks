import React from 'react';
import { Card } from '../card/card';
import { CardCenteredElement } from '../card/cardCenteredElement';
import { CardSpaceElement } from '../card/cardSpaceElement';
import { Image } from '../image/image';
import { Spacing } from '../spacing/spacing';
import { H3 } from "../typography/h3";
import { P } from "../typography/p";
import { H6 } from '../typography/h6';

interface Props {
    tokenId: string
    projectId: string
    name: string
    description: string
    token: string
}

export const Token: React.FC<Props> = ({ tokenId, name, description, token }) => {
    return (
        <Card width={384}>
            <H3>{name}</H3>
            <CardCenteredElement>
                <Image id="key" size="xl" scaleFactor={5} />
            </CardCenteredElement>
            <Spacing spacing="m" />
            <H6>Token id:</H6>
            <P>{tokenId}</P>
            {description && (
                <>
                    <H6>Description:</H6>
                    <P>{description}</P>
                </>
            )}
            <H6>Token:</H6>
            <P>{token}</P>
            <CardSpaceElement />
        </Card>
    );
};
