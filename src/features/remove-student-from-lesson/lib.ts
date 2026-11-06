import type { ConfirmOptions } from '@/shared/ui-kit';

export type RemoveStudentError = 'unauthorized' | 'not_booked' | 'already_attended' | 'unknown';

export type RemoveStudentResult = { ok: true } | { ok: false; error: RemoveStudentError };

// Студенческие страницы тоже: у ученика пропадёт запись
export const REMOVE_STUDENT_PATHS = ['/teacher', '/teacher/calendar', '/calendar', '/home', '/bookings'];

export const REMOVE_ICON_SIZE = 16;

export const CONFIRM_OPTIONS: ConfirmOptions = {
    title: 'Убрать ученика с занятия?',
    description: 'Запись ученика будет отменена. Его можно будет добавить снова.',
    confirmText: 'Убрать',
    cancelText: 'Назад',
    danger: true,
};

export const getConfirmOptions = (studentName: string): ConfirmOptions => ({
    ...CONFIRM_OPTIONS,
    title: `Убрать ${studentName} с занятия?`,
});

const REMOVE_STUDENT_ERROR_MESSAGES: Record<RemoveStudentError, string> = {
    unauthorized: 'Нет прав',
    not_booked: 'Ученик уже не записан на занятие',
    already_attended: 'Ученик отмечен на занятии: сначала снимите отметку и сохраните',
    unknown: 'Что-то пошло не так, попробуйте позже',
};

export const getRemoveStudentErrorMessage = (error: RemoveStudentError) => REMOVE_STUDENT_ERROR_MESSAGES[error];
