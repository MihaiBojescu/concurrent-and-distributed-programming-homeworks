import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const P: React.FC<Props> = ({ children }) => {
    return <p className="p">{children}</p>
}