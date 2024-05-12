import { FC, ReactNode } from "react";
import './header.css'

interface Props {
    children?: ReactNode
}

export const HeaderActionSlot: FC<Props> = ({ children }) => {
    return <div className="header-action-slot">{children}</div>
}