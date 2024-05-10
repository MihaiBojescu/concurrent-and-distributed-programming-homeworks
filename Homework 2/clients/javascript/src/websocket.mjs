export const getWebsocketImplementation = async () => {
    if (typeof WebSocket !== 'undefined') {
        return WebSocket
    }

    if (typeof MozWebSocket !== 'undefined') {
        return MozWebSocket
    }
    
    if (typeof global !== 'undefined') {
        if (typeof global.WebSocket !== 'undefined') {
            return global.WebSocket
        }

        if (typeof global.MozWebSocket !== 'undefined') {
            return global.MozWebSocket
        }
    }
    
    if (typeof window !== 'undefined') {
        if (typeof window.WebSocket !== 'undefined') {
            return window.WebSocket
        }

        if (typeof window.MozWebSocket !== 'undefined') {
            return window.MozWebSocket
        }
    }
    
    if (typeof self !== 'undefined') {
        if (typeof self.WebSocket !== 'undefined') {
            return self.WebSocket
        }

        if (typeof self.MozWebSocket !== 'undefined') {
            return self.MozWebSocket
        }
    }

    return (await import('ws')).default
}
