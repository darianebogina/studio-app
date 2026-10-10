import styles from './styles.module.scss';

type SpinnerProps = {
    size?: 'sm' | 'md';
    color?: 'light' | 'dark';
    className?: string;
};

// <span>, а не <div>: спиннер стоит внутри <button>, а там допустим только строчный контент
export const Spinner = ({ size = 'sm', color = 'light', className }: SpinnerProps) => (
    <span
        aria-hidden="true"
        className={`${styles.spinner} ${styles[size]} ${styles[color]} ${className ?? ''}`}
    />
);
