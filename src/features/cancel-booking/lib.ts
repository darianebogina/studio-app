import type { ConfirmOptions } from '@/shared/ui-kit';

export type CancelBookingError = 'unauthorized' | 'not_booked' | 'lesson_started' | 'unknown';

export type CancelBookingResult = { ok: true } | { ok: false; error: CancelBookingError };

export const BOOKING_PATHS = ['/calendar', '/home', '/bookings'];

export const CONFIRM_OPTIONS: ConfirmOptions = {
    title: 'Отменить запись?',
    description: 'Запись на занятие будет отменена.',
    confirmText: 'Отменить запись',
    cancelText: 'Назад',
    danger: true,
};

const CANCEL_ERROR_MESSAGES: Record<CancelBookingError, string> = {
    unauthorized: 'Войдите в аккаунт',
    not_booked: 'Вы не записаны на это занятие',
    lesson_started: 'Занятие уже началось, отменить запись нельзя',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getCancelErrorMessage = (error: CancelBookingError) => CANCEL_ERROR_MESSAGES[error];
