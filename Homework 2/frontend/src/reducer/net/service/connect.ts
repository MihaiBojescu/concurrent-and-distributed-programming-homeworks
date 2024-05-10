import { NetConnectedAction, NetState } from "../types";

export const connectHandler = (state: NetState, action: NetConnectedAction) => ({
    connected: true
})

