import { MouseEvent } from 'react'
import './input.css'

interface Props {
    onClick: () => void
    disabled?: boolean
    children?: string | React.ReactNode
}

export const Button: React.FC<Props> = ({ onClick, disabled, children }) => {
    const onClickInterceptor = (event: MouseEvent) => {
        onClick()
    }

    return (
        <button
            onClick={onClickInterceptor}
            disabled={disabled}
            className="button"
        >
            {children}
        </button>
    )
}