import { useCallback, useEffect, useRef, useState } from "react"

export const useInterval = (milliseconds: number, callback: () => void) => {
    const interval = useRef<number | null>(null)
    const [count, setCount] = useState(0)

    const start = useCallback(() => {
        interval.current = setInterval(callback, milliseconds) as any
        setCount(0)
    }, [callback])

    const end = () => {
        if (interval.current) {
            clearInterval(interval.current)
        }
    }

    useEffect(() => {
        return () => {
            end()
        }
    }, [callback])

    useEffect(() => {
        return () => {
            end()
        }
    }, [])

    return {
        count,
        start,
        end
    }
}