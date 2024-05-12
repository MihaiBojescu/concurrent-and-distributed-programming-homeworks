import './input.css'

interface Props {
    value: string,
    onChange: (value: string) => void
    placeholder?: string
    invalid?: boolean
    masked?: boolean

    children?: React.ReactNode
}

export const Dropdown: React.FC<Props> = ({ value, onChange, children }) => {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="dropdown-field"
        >
            {children}
        </select>
    )
}