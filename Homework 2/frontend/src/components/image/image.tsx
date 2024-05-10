import { useMemo } from 'react'
import { svg } from '../../resources/svg'

interface Props {
    id: keyof typeof svg,
    size?: 'xs' | 's' | 'm' | 'l' | 'xl'
    scaleFactor?: number
}

export const Image: React.FC<Props> = ({ id, size, scaleFactor }) => {
    let Component: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
    }> = () => <></>
    const sizeValue = useMemo(() => {
        const cssValueRaw = getComputedStyle(document.documentElement).getPropertyValue(`--${size || 'm'}-size`)
        const cssValue = Number(cssValueRaw.replace('px', ''))
        return `${cssValue * (scaleFactor || 1)}px`
    }, [size, scaleFactor]);

    if (id in svg) {
        Component = svg[id]
    }

    return <Component width={sizeValue} height={sizeValue} preserveAspectRatio='none' />
}
