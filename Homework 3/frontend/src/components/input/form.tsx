import { FormEvent } from 'react'
import './input.css'

interface Props {
    onSubmit: () => void
    disabled?: boolean
    children?: string | React.ReactNode
}

export const Form: React.FC<Props> = ({ onSubmit, children }) => {
    const onSubmitInterceptor = (event: FormEvent) => {
        event.preventDefault()
        onSubmit()
    }

    return (
        <form
            onSubmit={onSubmitInterceptor}
            className="form"
        >
            {children}
        </form>
    )
}