import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H4: React.FC<Props> = ({ children }) => {
    return <h4 className="h4">{children}</h4>
}