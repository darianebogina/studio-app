import type { LessonType, Subscription } from '@/shared/types';

export type BookLessonError =
    | 'unauthorized'
    | 'lesson_unavailable'
    | 'no_subscription'
    | 'no_remaining'
    | 'already_booked'
    | 'unknown';

export type BookLessonResult = { ok: true } | { ok: false; error: BookLessonError };

export const BOOKING_PATHS = ['/calendar', '/home', '/bookings'];

export const REMAINING_FIELDS: Record<
    LessonType,
    keyof Pick<Subscription, 'group_remaining' | 'individual_remaining'>
> = {
    vogue: 'group_remaining',
    individual: 'individual_remaining',
};

// Код ошибки Postgres при нарушении unique (lesson_id, user_id)
export const UNIQUE_VIOLATION_CODE = '23505';

const BOOK_ERROR_MESSAGES: Record<BookLessonError, string> = {
    unauthorized: 'Войдите в аккаунт',
    lesson_unavailable: 'Занятие недоступно',
    no_subscription: 'Нет активного абонемента',
    no_remaining: 'На абонементе не осталось занятий',
    already_booked: 'Вы уже записаны',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getBookErrorMessage = (error: BookLessonError) => BOOK_ERROR_MESSAGES[error];
