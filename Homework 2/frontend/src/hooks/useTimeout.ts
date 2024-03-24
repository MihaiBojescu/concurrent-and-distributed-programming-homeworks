import { useCallback, useEffect, useRef } from "react"

export const useTimeout = (milliseconds: number, callback: () => void, dependencies: any[]) => {
    const timeout = useRef<number | null>(null)

    const start = useCallback(() => {
        console.log('start timer ')
        timeout.current = setTimeout(callback, milliseconds) as any
    }, dependencies)

    const end = () => {
        console.log('end timer')
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
    }

    useEffect(() => {
        console.log('timer cleanup')

        return () => {
            end()
        }
    }, dependencies)

    return {
        start,
        end
    }
}