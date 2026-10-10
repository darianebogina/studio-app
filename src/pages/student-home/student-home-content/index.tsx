import { ProfileHeader } from '@/widgets/profile-header';
import { SubscriptionBlock } from '@/widgets/subscription-block';
import { getActiveSubscription, getLedgerEntries, getUserRole } from '@/shared/api/server';

export const StudentHomeContent = async () => {
    const user = await getUserRole();

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    const [subscription, ledgerEntries] = await Promise.all([
        getActiveSubscription(user.id),
        getLedgerEntries(user.id),
    ]);

    return (
        <>
            <ProfileHeader user={user} />

            <SubscriptionBlock
                subscription={subscription}
                ledgerEntries={ledgerEntries}
            />
        </>
    );
};
