import type { CSSProperties } from 'react';
import styles from './styles.module.scss';

type SkeletonProps = {
    width?: string | number;
    height?: string | number;
    variant?: 'rectangular' | 'circular';
    borderRadius?: string;
    margin?: string;
    padding?: string;
    style?: CSSProperties;
    className?: string;
};

export const Skeleton = ({
    width = '100%',
    height = '16px',
    variant = 'rectangular',
    borderRadius = 'var(--radius-sm)',
    margin,
    padding,
    style,
    className,
}: SkeletonProps) => {
    const isCircular = variant === 'circular';

    const combinedStyle = {
        width: isCircular ? height : width,
        height,
        borderRadius: isCircular ? '50%' : borderRadius,
        margin,
        padding,
        ...style,
    };

    return (
        <div
            aria-hidden="true"
            style={combinedStyle}
            className={`${styles.skeleton} ${className ?? ''}`}
        />
    );
};
