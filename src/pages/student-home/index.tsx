import { redirect } from 'next/navigation';
import { LogoutButton } from '@/features/auth';
import { getUserRole } from '@/shared/lib/utils';
import styles from './styles.module.scss';

export const StudentHomePage = async () => {
    const user = await getUserRole();

    if (!user) {
        redirect('/login');
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Главная ученика</h1>

            <p className={styles.text}>Привет, {user.first_name}!</p>
            <p className={styles.text}>Роль: {user.role}</p>
            <p className={styles.text}>Email: {user.email}</p>
            <p className={styles.text}>Телефон: {user.phone ?? '—'}</p>

            <div className={styles.logout}>
                <LogoutButton />
            </div>
        </main>
    );
};
