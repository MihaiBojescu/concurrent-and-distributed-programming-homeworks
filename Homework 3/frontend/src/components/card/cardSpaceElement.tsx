import { FC } from 'react'
import './card.css'

interface Props {
    children?: React.ReactNode
}

export const CardSpaceElement: FC<Props> = ({ children }) => {
    return (
        <div className="card-space-element">
            {children}
        </div>
    )
}
