import { FC } from 'react'
import './card.css'

interface Props {
    noBorder?: boolean
    noShadow?: boolean
    centered?: boolean
    width?: number | string
    direction?: 'column' | 'row'
    children: React.ReactNode
}

export const Card: FC<Props> = ({ noBorder, noShadow, centered, width, direction, children }) => {
    const borderClass = noBorder ? '' : 'card-border'
    const shadowClass = noShadow ? '' : 'card-shadow'
    const centeredClass = !centered ? '' : 'card-centered'
    const directionClass = `card-${direction || 'column'}`
    const widthStyle = width === undefined ? 'auto' : width

    return (
        <div 
            className={`card ${borderClass} ${shadowClass} ${centeredClass} ${directionClass}`}
            style={{ width: widthStyle }}
        >
            {children}
        </div>
    )
}
