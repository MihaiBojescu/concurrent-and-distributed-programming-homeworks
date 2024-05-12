import { FC } from "react";
import './card.css'

interface Props {
    direction?: 'column' | 'row'
    children: React.ReactNode
}

export const CardList: FC<Props> = ({ direction, children }) => {
    const directionClass = `card-list-${direction || 'row'}`

    return (
        <div className={`card-list ${directionClass}`}>{children}</div>
    )
}
