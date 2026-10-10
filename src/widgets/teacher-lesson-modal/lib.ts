import type { BookingWithStudent, LessonType, Subscription } from '@/shared/types';

type SubscriptionBalance = {
    remaining: number;
    total: number;
};

export const NO_SUBSCRIPTION_LABEL = 'Нет абонемента';

export const ADD_STUDENT_ICON_SIZE = 16;

export const getSubscriptionBalance = (subscription: Subscription, type: LessonType): SubscriptionBalance =>
    type === 'vogue'
        ? { remaining: subscription.group_remaining, total: subscription.group_total }
        : { remaining: subscription.individual_remaining, total: subscription.individual_total };

export const getAttendedBookingIds = (bookings: BookingWithStudent[]) => new Set(bookings
    .filter(({ booking }) => booking.status === 'attended')
    .map(({ booking }) => booking.id));

export const isSameIds = (first: Set<string>, second: Set<string>) =>
    first.size === second.size && [...first].every((id) => second.has(id));
