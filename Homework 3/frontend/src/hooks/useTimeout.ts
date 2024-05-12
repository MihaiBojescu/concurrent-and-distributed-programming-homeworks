import { useCallback, useEffect, useRef } from "react"

export const useTimeout = (milliseconds: number, callback: () => void, dependencies: any[]) => {
    const timeout = useRef<number | null>(null)

    const start = useCallback(() => {
        timeout.current = setTimeout(callback, milliseconds) as any
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    const end = () => {
        if (!timeout.current) {
            return
        }

        clearTimeout(timeout.current)
        timeout.current = null
    }

    useEffect(() => {
        return () => {
            end()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    return {
        start,
        end
    }
}