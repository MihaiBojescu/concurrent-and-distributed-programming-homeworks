import './page.css'

interface Props {
    children: React.ReactNode
    centered?: boolean
}

export const Page: React.FC<Props> = ({ centered, children }) => {
    return <main className={`page ${centered && 'page-centered'}`}>{children}</main>
}