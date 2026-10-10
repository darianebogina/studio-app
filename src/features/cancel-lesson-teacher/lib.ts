export type CancelLessonError = 'unauthorized' | 'lesson_unavailable' | 'unknown';

export type CancelLessonResult = { ok: true } | { ok: false; error: CancelLessonError };

export const LESSON_PATHS = ['/teacher', '/teacher/calendar', '/calendar', '/home', '/bookings'];

export const CONFIRM_MESSAGE = 'Отменить занятие? Все записи сохранятся как есть.';

const CANCEL_LESSON_ERROR_MESSAGES: Record<CancelLessonError, string> = {
    unauthorized: 'Нет прав для отмены занятия',
    lesson_unavailable: 'Занятие не найдено или уже отменено',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getCancelLessonErrorMessage = (error: CancelLessonError) => CANCEL_LESSON_ERROR_MESSAGES[error];
