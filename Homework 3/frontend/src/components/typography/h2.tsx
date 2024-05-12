import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H2: React.FC<Props> = ({ children }) => {
    return <h2 className="h2">{children}</h2>
}