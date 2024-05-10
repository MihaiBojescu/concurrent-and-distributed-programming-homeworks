import { FC } from 'react'
import './spacing.css'

interface Props {
    spacing: 'xs' | 's' | 'm' | 'l' | 'xl' 
    children?: React.ReactNode
}

export const Spacing: FC<Props> = ({ spacing, children }) => {
    return <div className={`spacing-${spacing}`}>{children}</div>
}