import type { ReactNode } from 'react';
import styles from './styles.module.scss';

type AuthLayoutProps = {
    children: ReactNode;
    title: string;
    subtitle?: string;
    showLogo?: boolean;
};

export const AuthLayout = ({ children, title, subtitle, showLogo }: AuthLayoutProps) => (
    <main className={styles.container}>
        <div className={styles.card}>
            {showLogo && <div className={styles.logo}>💃</div>}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children}
        </div>
    </main>
);