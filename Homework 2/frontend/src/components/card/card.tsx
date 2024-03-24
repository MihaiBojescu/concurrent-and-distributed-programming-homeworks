import './card.css'

interface Props {
    children: React.ReactNode
}

export const Card: React.FC<Props> = ({ children }) => {
    return <div className="card">{children}</div>
}