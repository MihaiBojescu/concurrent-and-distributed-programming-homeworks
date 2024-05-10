import { NotificationsRemoveAction, NotificationsState } from '../types';

export const removeHandler = (state: NotificationsState, action: NotificationsRemoveAction): NotificationsState => {
    const index = state.notifications.findIndex(item => item.id === action.data.id);
    return {
        ...state,
        notifications: index === -1 ? state.notifications : [...state.notifications.slice(0, index), ...state.notifications.slice(index + 1)]
    };
};
