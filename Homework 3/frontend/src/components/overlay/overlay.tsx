import { FC } from "react";
import './overlay.css'

interface Props {
    type: 'transparent' | 'opaque'
    children: React.ReactNode
}

export const Overlay: FC<Props> = ({ type, children }) => {
    return <div className={`overlay ${type}`}>{children}</div>
}
