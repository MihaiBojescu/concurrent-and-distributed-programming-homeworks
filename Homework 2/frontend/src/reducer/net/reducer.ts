import React from 'react'
import { NetActions, NetState } from './types'
import { connectHandler } from './service/connect'
import { disconnectHandler } from './service/disconnect'

export const netInitialState: NetState = ({
    connected: undefined
})

export const netReducer: React.Reducer<NetState, NetActions> = (state, action) => {
    switch (action.type) {
        case 'net-connected':
            return connectHandler(state, action)
        case 'net-disconnected':
            return disconnectHandler(state, action)
        default:
            return state
    }
}




