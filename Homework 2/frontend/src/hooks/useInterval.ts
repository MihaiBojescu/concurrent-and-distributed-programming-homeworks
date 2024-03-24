import { useCallback, useEffect, useRef, useState } from "react"

export const useInterval = (milliseconds: number, callback: () => void, dependencies: any[]) => {
    const interval = useRef<number | null>(null)

    const start = useCallback(() => {
        interval.current = setInterval(callback, milliseconds) as any
    }, dependencies)

    const end = () => {
        if (interval.current) {
            clearInterval(interval.current)
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