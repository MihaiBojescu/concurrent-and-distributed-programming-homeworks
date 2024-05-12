import { FC } from 'react'
import './card.css'

interface Props {
    children: React.ReactNode
}

export const CardCenteredElement: FC<Props> = ({ children }) => {
    return (
        <div className="card-centered-element">
            {children}
        </div>
    )
}
