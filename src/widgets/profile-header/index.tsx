import { Avatar } from '@/entities/user';
import type { UserProfile } from '@/shared/types';
import styles from './styles.module.scss';

type ProfileHeaderProps = {
    user: UserProfile;
};

export const ProfileHeader = ({ user }: ProfileHeaderProps) => (
    <header className={styles.profileHeader}>
        <Avatar
            firstName={user.first_name}
            lastName={user.last_name}
            size="lg"
        />

        <div className={styles.info}>
            <p className={styles.name}>{user.first_name} {user.last_name}</p>

            {user.phone && <p className={styles.phone}>{user.phone}</p>}
        </div>
    </header>
);
