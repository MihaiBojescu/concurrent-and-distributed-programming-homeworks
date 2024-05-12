import { MouseEvent } from 'react'
import './input.css'

interface Props {
    onClick?: () => void
    disabled?: boolean
    type?: 'submit' | 'reset' | 'button'
    children?: string | React.ReactNode
}

export const Button: React.FC<Props> = ({ onClick, disabled, type, children }) => {
    const onClickInterceptor = (event: MouseEvent) => {
        if (!onClick) {
            return
        }

        event.preventDefault()
        onClick()
    }

    return (
        <button
            onClick={onClickInterceptor}
            disabled={disabled}
            type={type}
            className="button"
        >
            {children}
        </button>
    )
}