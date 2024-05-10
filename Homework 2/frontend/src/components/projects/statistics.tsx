import React from 'react';
import { H3 } from "../../components/typography/h3"
import { P } from "../../components/typography/p"
import { Span } from "../../components/typography/span"
import { Link } from "../control/link"
import { time } from 'console';

interface Props {
    timestamp: string;
    value: number;
}

export const ProjectStatistics: React.FC<Props> = ({ timestamp, value }) => {
    return (
        <Span>
             <P>Timestamp: {timestamp}</P>
             <P>Value: {value}</P>
        </Span>
           
    );
};
