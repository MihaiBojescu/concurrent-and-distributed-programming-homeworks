import { FC } from "react";
import { createPortal } from "react-dom";
import { NotificationsOverlay } from "./notificationsOverlay";

export const Notifications: FC = () => {
    return <>{createPortal(<NotificationsOverlay />, document.body)}</>
}
