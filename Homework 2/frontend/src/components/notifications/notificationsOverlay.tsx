import { FC, useContext } from 'react'
import './notifications.css'
import { NotificationsContext } from '../../reducer/notifications/context'
import { Notification } from './notification'

export const NotificationsOverlay: FC = () => {
    const [notificationsState, notificationsDispatch] = useContext(NotificationsContext)

    const remove = (id: string) => () => {
        notificationsDispatch({ type: 'notifications-remove', data: { id } })
    }

    return (
        <div className='overlay'>
            {notificationsState.notifications.map((notification, index) => (
                <Notification key={index} {...notification} onClick={remove(notification.id)} />
            ))}
        </div>
    )
}