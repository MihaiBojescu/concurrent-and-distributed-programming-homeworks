import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H3: React.FC<Props> = ({ children }) => {
    return <h3 className="h3">{children}</h3>
}