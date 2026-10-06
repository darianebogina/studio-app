'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ICON_SIZE, TABS, isTabActive } from './lib';
import styles from './styles.module.scss';

export const TeacherTabBar = () => {
    const pathname = usePathname();

    return (
        <nav className={styles.teacherTabBar}>
            {TABS.map(({ href, label, icon: Icon }) => {
                const isActive = isTabActive(pathname ?? '', href);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`${styles.tab} ${isActive ? styles.active : ''}`}
                    >
                        <Icon size={ICON_SIZE} />

                        {isActive && <span className={styles.label}>{label}</span>}
                    </Link>
                );
            })}
        </nav>
    );
};
