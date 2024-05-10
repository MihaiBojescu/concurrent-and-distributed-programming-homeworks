import { NetDisconnectedAction, NetState } from "../types";

export const disconnectHandler = (state: NetState, action: NetDisconnectedAction) => ({
    connected: false
});
