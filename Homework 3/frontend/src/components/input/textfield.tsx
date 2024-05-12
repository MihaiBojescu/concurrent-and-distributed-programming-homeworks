import './input.css'

interface Props {
    value: string,
    onChange: (value: string) => void
    placeholder?: string
    invalid?: boolean
    masked?: boolean
}

export const TextField: React.FC<Props> = ({ value, onChange, placeholder, invalid, masked }) => {
    return <input
        type={!masked ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`text-field ${!invalid && 'text-field-invalid'}`}
    />
}