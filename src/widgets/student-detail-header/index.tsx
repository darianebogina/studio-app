import { Avatar } from '@/entities/user';
import type { UserProfile } from '@/shared/types';
import styles from './styles.module.scss';

type StudentDetailHeaderProps = {
    user: UserProfile;
};

export const StudentDetailHeader = ({ user }: StudentDetailHeaderProps) => (
    <header className={styles.studentDetailHeader}>
        <Avatar
            firstName={user.first_name}
            lastName={user.last_name}
            size="lg"
        />

        <div className={styles.info}>
            <h1 className={styles.name}>{user.first_name} {user.last_name}</h1>

            <p className={styles.contacts}>
                {user.phone ? `${user.phone} · ${user.email}` : user.email}
            </p>
        </div>
    </header>
);
