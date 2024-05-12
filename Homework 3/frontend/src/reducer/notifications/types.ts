export type NotificationType = 'positive' | 'negative' | 'neutral'

export type Notification = {
    type: NotificationType
    title: string
    description: string
}
