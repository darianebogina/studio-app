import type { Subscription } from '@/shared/types';

type SubscriptionBadge = {
    label: string;
    isEmpty: boolean;
};

const EMPTY_BADGE: SubscriptionBadge = { label: '0/0', isEmpty: true };

export const getSubscriptionBadge = (subscription: Subscription | null): SubscriptionBadge => {
    if (!subscription) return EMPTY_BADGE;

    const {
        group_total: groupTotal,
        group_remaining: groupRemaining,
        individual_total: individualTotal,
        individual_remaining: individualRemaining,
    } = subscription;

    const parts = [
        ...(groupTotal > 0 ? [`${groupRemaining}/${groupTotal}`] : []),
        ...(individualTotal > 0 ? [`${individualRemaining} инд`] : []),
    ];

    return {
        label: parts.length > 0 ? parts.join(' · ') : EMPTY_BADGE.label,
        isEmpty: groupRemaining === 0 && individualRemaining === 0,
    };
};
