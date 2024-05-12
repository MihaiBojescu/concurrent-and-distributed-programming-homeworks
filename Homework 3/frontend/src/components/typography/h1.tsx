import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H1: React.FC<Props> = ({ children }) => {
    return <h1 className="h1">{children}</h1>
}