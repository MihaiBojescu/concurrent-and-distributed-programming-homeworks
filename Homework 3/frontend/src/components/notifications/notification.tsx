import { FC, useEffect } from "react"
import { NotificationType } from "../../reducer/notifications/types"
import { H6 } from "../typography/h6"
import { P } from "../typography/p"
import './notifications.css'

interface Props {
    type: NotificationType
    title: string
    description: string

    onClick: () => void
}

export const Notification: FC<Props> = ({ type, title, description, onClick }) => {
    useEffect(() => {
        let timer: NodeJS.Timer | undefined = undefined

        const handler = () => {
            timer = setTimeout(() => {
                onClick()
            }, 2000)
        }

        window.addEventListener('mousemove', handler)

        return () => {
            if (timer !== undefined) {
                clearTimeout(timer)
            }
        }
    })

    return (
        <div className={`notification notification-${type}`} onClick={onClick}>
            <H6>{title}</H6>
            <P>{description}</P>
        </div>
    )
}
