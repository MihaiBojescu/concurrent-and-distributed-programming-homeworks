import { useEffect, useState } from "react"

export const useTitle = (title: string) => {
    const [oldTitle, ] = useState(document.title)

    useEffect(() => {
        document.title = title

        return () => {
            document.title = oldTitle
        }
    }, [oldTitle])
}