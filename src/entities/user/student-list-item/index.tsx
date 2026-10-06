import Link from 'next/link';
import type { Subscription, UserProfile } from '@/shared/types';
import { Avatar } from '../avatar';
import { getSubscriptionBadge } from './lib';
import styles from './styles.module.scss';

type StudentListItemProps = {
    user: UserProfile;
    subscription: Subscription | null;
};

export const StudentListItem = ({ user, subscription }: StudentListItemProps) => {
    const { label, isEmpty } = getSubscriptionBadge(subscription);

    return (
        <Link
            href={`/teacher/students/${user.id}`}
            className={styles.studentListItem}
        >
            <Avatar
                firstName={user.first_name}
                lastName={user.last_name}
                size="md"
            />

            <span className={styles.info}>
                <span className={styles.name}>{user.first_name} {user.last_name}</span>

                {user.phone && <span className={styles.phone}>{user.phone}</span>}
            </span>

            <span className={`${styles.badge} ${isEmpty ? styles.empty : ''}`}>{label}</span>
        </Link>
    );
};
