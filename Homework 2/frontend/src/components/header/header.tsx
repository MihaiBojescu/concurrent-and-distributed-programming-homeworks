import React, { FC, ReactNode } from "react";
import './header.css'

interface Props {
    left?: ReactNode
    right?: ReactNode
}

export const Header: FC<Props> = ({ left, right }) => {
    return (
        <div className="header">
            <div className="header-left">{left}</div>
            <div className="header-right">{right}</div>
        </div>
    )
}
