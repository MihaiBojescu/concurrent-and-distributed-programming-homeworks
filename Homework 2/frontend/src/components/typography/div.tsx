import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const Div: React.FC<Props> = ({ children }) => {
    return <div className="div">{children}</div>
}