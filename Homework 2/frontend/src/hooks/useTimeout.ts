import { useCallback, useEffect, useRef } from "react"

export const useTimeout = (milliseconds: number, callback: () => void, dependencies: any[]) => {
    const timeout = useRef<number | null>(null)

    const start = useCallback(() => {
        timeout.current = setTimeout(callback, milliseconds) as any
    }, dependencies)

    const end = () => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
    }

    useEffect(() => {
        return () => {
            end()
        }
    }, dependencies)

    return {
        start,
        end
    }
}