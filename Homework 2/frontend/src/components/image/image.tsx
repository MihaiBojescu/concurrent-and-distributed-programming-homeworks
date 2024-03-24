import { svg } from '../../resources/svg'

interface Props {
    id: keyof typeof svg
}

export const Image: React.FC<Props> = ({ id }) => {
    let Component: React.FC = () => <></>

    if (id in svg) {
        Component = svg[id]
    }

    return <Component />
}