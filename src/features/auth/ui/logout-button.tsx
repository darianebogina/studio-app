'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/shared/api';
import styles from './styles.module.scss';

export const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await createBrowserClient().auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            Выйти
        </button>
    );
};
