import './input.css'

interface Props {
    value: string,
    onChange: (value: string) => void
    disabled?: boolean
    placeholder?: string
    invalid?: boolean
    masked?: boolean

    children?: React.ReactNode
}

export const Dropdown: React.FC<Props> = ({ value, onChange, disabled, children }) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            className="dropdown-field"
        >
            {children}
        </select>
    )
}