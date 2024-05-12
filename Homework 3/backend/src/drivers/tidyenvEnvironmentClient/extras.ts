import { tidyEnv } from "tidyenv"

export const stringArray = tidyEnv.generic<string[]>({
    type: 'string[]',
    validator(value) {
        if (!value) {
            return false
        }

        try {
            const parsed = JSON.parse(value)
            return typeof parsed === 'object' && parsed !== null && Array.isArray(parsed)
        } catch {
            return false
        }
    },
    converter(value) {
        return JSON.parse(value)
    },
})
