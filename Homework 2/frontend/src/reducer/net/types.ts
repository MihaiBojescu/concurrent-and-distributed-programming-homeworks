export type NetState = {
    connected: undefined | boolean
}

export type NetConnectedAction = { type: 'net-connected' }
export type NetDisconnectedAction = { type: 'net-disconnected' }
export type NetActions =
    | NetConnectedAction
    | NetDisconnectedAction
