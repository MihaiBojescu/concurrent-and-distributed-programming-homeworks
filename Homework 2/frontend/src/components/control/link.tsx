import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
    href: string;
    target?: string;
    className?: string;
    children: React.ReactNode | string;
}

export const Link: React.FC<Props> = ({ href, target, className, children }) => {
    return (
        <RouterLink to={href} target={target} className={className}>
            {children}
        </RouterLink>
    );
};
