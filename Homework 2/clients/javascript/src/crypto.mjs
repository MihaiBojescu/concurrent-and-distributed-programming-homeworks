export const getCryptoImplementation = async () => {
    if (typeof crypto !== 'undefined') {
        return crypto
    }

    if (typeof global !== 'undefined' && typeof global.crypto !== 'undefined') {
        return global.crypto
    }
    
    if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
        return window.crypto
    }
    
    if (typeof self !== 'undefined' && typeof self.crypto !== 'undefined') {
        return self.crypto
    }

    return (await import('crypto')).default
}
