import './input.css'

interface Props {
    value: string,
    onChange: (value: string) => void
    placeholder?: string
}

export const TextField: React.FC<Props> = ({ value, onChange, placeholder }) => {
    return <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="text-field"
    />
}