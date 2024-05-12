import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const Span: React.FC<Props> = ({ children }) => {
    return <span className="span">{children}</span>
}