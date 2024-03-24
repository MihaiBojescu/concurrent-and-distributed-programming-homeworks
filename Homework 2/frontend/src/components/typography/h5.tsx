import './typography.css'

interface Props {
    children: string | React.ReactNode
}

export const H5: React.FC<Props> = ({ children }) => {
    return <h5 className="h5">{children}</h5>
}