import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H6: React.FC<Props> = ({ children }) => {
    return <h6 className="h6">{children}</h6>
}