import { FC, ReactNode } from "react";
import './input.css'

interface Props {
    children?: ReactNode
}

export const ButtonRow: FC<Props> = ({ children }) => {
    return <div className="button-row">{children}</div>
} 