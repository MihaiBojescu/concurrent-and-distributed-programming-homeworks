import './animate.css'

interface Props {
    children: React.ReactNode
}

export const Spin: React.FC<Props> = ({ children }) => {
    return <div className="spin">{children}</div>
}
