import { FC } from 'react'
import { getNotifications, removeNotification } from '../../reducer/notifications/reducer'
import { useAppDispatch, useAppSelector } from '../../reducer/store'
import { Notification } from './notification'
import './notifications.css'

export const NotificationsOverlay: FC = () => {
    const dispatch = useAppDispatch()
    const notifications = useAppSelector(getNotifications)

    const remove = (id: string) => () => {
        dispatch(removeNotification({ id }))
    }

    return (
        <div className='overlay'>
            {notifications.map((notification, index) => (
                <Notification key={index} {...notification} onClick={remove(notification.id)} />
            ))}
        </div>
    )
}