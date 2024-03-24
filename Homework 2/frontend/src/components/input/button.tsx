import './input.css'

interface Props {
    onClick: () => void
    disabled?: boolean
    children?: string | React.ReactNode
}

export const Button: React.FC<Props> = ({ onClick, disabled, children }) => {
    return (
        <button
            onClick={() => onClick()}
            disabled={disabled}
            className="button"
        >
            {children}
        </button>
    )
}