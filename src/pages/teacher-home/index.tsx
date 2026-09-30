import { redirect } from 'next/navigation';
import { LogoutButton } from '@/features/auth';
import { getUserRole } from '@/shared/api/server';
import styles from './styles.module.scss';

export const TeacherHomePage = async () => {
    const user = await getUserRole();

    if (!user) {
        redirect('/login');
    }

    return (
        <main className={styles.teacherHomePage}>
            <h1 className={styles.title}>Кабинет преподавателя</h1>

            <p className={styles.text}>Привет, {user.first_name}!</p>
            <p className={styles.text}>Роль: {user.role}</p>

            <div className={styles.logout}>
                <LogoutButton />
            </div>
        </main>
    );
};
