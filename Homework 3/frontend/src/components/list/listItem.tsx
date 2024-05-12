import { FC } from "react";
import './list.css'

export type ListItemType = 'single' | 'first' | 'middle' | 'last' | 'last-only-two'

interface Props {
    type: ListItemType
    children?: React.ReactNode
}

export const ListItem: FC<Props> = ({ type, children }) => {
    return (
        <div className={`list-item list-item-${type}`}>
            {children}
        </div>
    )
}