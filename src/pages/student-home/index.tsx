import { ProfileHeader } from '@/widgets/profile-header';
import { SubscriptionBlock } from '@/widgets/subscription-block';
import { LogoutButton } from '@/features/auth';
import { getActiveSubscription } from '@/entities/subscription/server';
import { getUserRole } from '@/shared/lib';
import styles from './styles.module.scss';

export const StudentHomePage = async () => {
    const user = await getUserRole();

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    const subscription = await getActiveSubscription(user.id);

    return (
        <main className={styles.studentHomePage}>
            <ProfileHeader user={user} />

            <SubscriptionBlock subscription={subscription} />

            <div className={styles.logout}>
                <LogoutButton />
            </div>
        </main>
    );
};
