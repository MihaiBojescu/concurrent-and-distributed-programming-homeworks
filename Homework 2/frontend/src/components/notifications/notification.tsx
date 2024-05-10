import { FC, useEffect } from "react"
import { H6 } from "../typography/h6"
import { P } from "../typography/p"
import { NotificationType } from "../../reducer/notifications/types"
import './notifications.css'

interface Props {
    type: NotificationType
    title: string
    description: string

    onClick: () => void
}

export const Notification: FC<Props> = ({ type, title, description, onClick }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClick()
        }, 2000)

        return () => {
            clearTimeout(timer)
        }
    })

    return (
        <div className={`notification notification-${type}`} onClick={onClick}>
            <H6>{title}</H6>
            <P>{description}</P>
        </div>
    )
}
